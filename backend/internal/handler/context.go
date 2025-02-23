package handler

import (
	"net/http"

	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
)

type userKey string

const userCtx userKey = "user"

func getUserFromCtx(r *http.Request) *store.User {
	user, _ := r.Context().Value(userCtx).(*store.User)
	return user
}

type tokenKey string

const tokenCtx tokenKey = "token"

func getTokenFromCtx(r *http.Request) *models.Token {
	token, _ := r.Context().Value(tokenCtx).(*models.Token)
	return token
}
