package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/gopher-social/internal/helper"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
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
			h.json.ServerErrorResponse(w, r, err)
			return
		}

		uCtx := context.WithValue(r.Context(), userCtx, &user)

		next.ServeHTTP(w, r.WithContext(uCtx))
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

		IsFollower, err := h.store.IsFollower(ctx, self.ID, userID)
		if err != nil || !IsFollower {
			h.json.UnauthorizedResponse(w, r, err)
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

		h.json.UnauthorizedResponse(w, r, errors.New("you cannot access this endpoint"))
	})
}
