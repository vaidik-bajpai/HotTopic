package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/gopher-social/internal/helper"
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

		// Proceed with the authenticated request
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
