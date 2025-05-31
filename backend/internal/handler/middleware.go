package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	limiter "github.com/ulule/limiter/v3"
	limiterMiddleware "github.com/ulule/limiter/v3/drivers/middleware/stdlib"
	redisStore "github.com/ulule/limiter/v3/drivers/store/redis"
	"github.com/vaidik-bajpai/gopher-social/internal/helper"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
	"go.uber.org/zap"
)

func (h *HTTPHandler) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("hottopic-auth")
		if err != nil {
			h.json.UnauthorizedResponse(w, r, err)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		userJSON, err := h.redisClient.Get(ctx, cookie.Value).Bytes()
		if err != nil {
			h.json.UnauthorizedResponse(w, r, err)
			return
		}

		var user store.User
		err = json.Unmarshal(userJSON, &user)
		if err != nil {
			h.json.UnauthorizedResponse(w, r, err)
			return
		}

		uCtx := context.WithValue(r.Context(), userCtx, &user)
		h.logger.Info("inside user authenticate", zap.String("username", user.Username))

		next.ServeHTTP(w, r.WithContext(uCtx))
	})
}

func (h *HTTPHandler) activated(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := getUserFromCtx(r)
		if !user.Activated {
			h.json.ForbiddenResponse(w, r, errors.New("user account not activated"))
			return
		}
		next.ServeHTTP(w, r.WithContext(r.Context()))
	})
}

func (h *HTTPHandler) tokenChecker(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := chi.URLParam(r, "token")
		if err := h.validate.Var(token, "required,len=26,base32"); err != nil {
			h.json.InvalidTokenResponse(w, r, err)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		tokenHash := helper.GenerateHash(token)

		tokenModel, err := h.store.GetTokenModel(ctx, tokenHash)
		if err != nil {
			switch {
			case errors.Is(err, store.ErrTokenNotFound):
				h.json.InvalidTokenResponse(w, r, err)
			case errors.Is(err, store.ErrTokenExpired):
				h.json.TokenExpiredResponse(w, r, err)
			default:
				h.json.ServerErrorResponse(w, r, err)
			}
			return
		}

		tCtx := context.WithValue(r.Context(), tokenCtx, tokenModel)

		next.ServeHTTP(w, r.WithContext(tCtx))
	})
}

func (h *HTTPHandler) paginate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		queryParams := r.URL.Query()

		pageSizeStr := queryParams.Get("page_size")
		lastID := queryParams.Get("last_id")

		pageSize, err := strconv.ParseInt(pageSizeStr, 10, 64)
		if err != nil {
			h.json.FailedValidationResponse(w, r, err)
			return
		}

		paginate := &models.Paginate{
			PageSize: pageSize,
			LastID:   lastID,
		}

		if err := h.validate.Struct(paginate); err != nil {
			h.json.FailedValidationResponse(w, r, err)
			return
		}

		h.logger.Info("paginate data", zap.Any("data", paginate))

		pCtx := context.WithValue(r.Context(), paginateCtxKey, paginate)

		next.ServeHTTP(w, r.WithContext(pCtx))
	})
}

func (h *HTTPHandler) canAccess(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := chi.URLParam(r, "userID")
		self := getUserFromCtx(r)
		if self.ID == userID {
			next.ServeHTTP(w, r)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err := h.store.IsFollower(ctx, self.ID, userID)
		if err != nil {
			h.json.ForbiddenResponse(w, r, err)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (h *HTTPHandler) onlyMe(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := chi.URLParam(r, "userID")
		self := getUserFromCtx(r)
		if self.ID == userID {
			next.ServeHTTP(w, r)
			return
		}

		h.json.ForbiddenResponse(w, r, errors.New("you cannot access this endpoint"))
	})
}

func (h *HTTPHandler) rateLimit(rateStr, keyPrefix string, preferUser bool) func(http.Handler) http.Handler {
	store, err := redisStore.NewStoreWithOptions(h.redisClient, limiter.StoreOptions{
		Prefix:   keyPrefix,
		MaxRetry: 3,
	})
	if err != nil {
		h.logger.Fatal("failed to create rate limiter store", zap.Error(err))
	}

	rate, err := limiter.NewRateFromFormatted(rateStr)
	if err != nil {
		h.logger.Fatal("invalid rate format", zap.String("rate", rateStr), zap.Error(err))
	}

	limiterInstance := limiter.New(store, rate)

	keyGetter := func(r *http.Request) string {
		if preferUser {
			user := getUserFromCtx(r)
			if user != nil && user.ID != "" {
				return fmt.Sprintf("user:%s", user.ID)
			}
		}
		ip := r.Header.Get("X-Real-IP")
		if ip == "" {
			ip, _, _ = net.SplitHostPort(r.RemoteAddr)
		}
		return fmt.Sprintf("ip:%s", ip)
	}

	middleware := limiterMiddleware.NewMiddleware(
		limiterInstance,
		limiterMiddleware.WithKeyGetter(keyGetter),
	)

	return middleware.Handler
}
