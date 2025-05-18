package handler

import (
	"net/http"

	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
)

type userKey string
type tokenKey string
type paginateKey string

const userCtx userKey = "user"
const tokenCtx tokenKey = "token"
const paginateCtxKey paginateKey = "paginate"

func getUserFromCtx(r *http.Request) *store.User {
	user, _ := r.Context().Value(userCtx).(*store.User)
	return user
}

func getTokenFromCtx(r *http.Request) *models.Token {
	token, _ := r.Context().Value(tokenCtx).(*models.Token)
	return token
}

func getPaginateFromCtx(r *http.Request) *models.Paginate {
	paginate, _ := r.Context().Value(paginateCtxKey).(*models.Paginate)
	return paginate
}
