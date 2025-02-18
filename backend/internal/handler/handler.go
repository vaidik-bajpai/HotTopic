package handler

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-playground/validator/v10"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
	"go.uber.org/zap"
)

type Handler interface {
	handleGetProfile(w http.ResponseWriter, r *http.Request)
	handleCreateProfile(w http.ResponseWriter, r *http.Request)
	handleUpdateProfile(w http.ResponseWriter, r *http.Request)
	handleGetFollowers(w http.ResponseWriter, r *http.Request)
	handleGetFollowing(w http.ResponseWriter, r *http.Request)
	handleGetLikedPosts(w http.ResponseWriter, r *http.Request)
	handleGetCommentedPosts(w http.ResponseWriter, r *http.Request)

	handleGetUserPosts(w http.ResponseWriter, r *http.Request)
	handleGetUserFeed(w http.ResponseWriter, r *http.Request)
	handleCreatePost(w http.ResponseWriter, r *http.Request)
	handleUpdatePost(w http.ResponseWriter, r *http.Request)
	handleDeletePost(w http.ResponseWriter, r *http.Request)
}

type HTTPHandler struct {
	logger   *zap.Logger
	store    store.Storer
	validate *validator.Validate
}

func NewHandler(logger *zap.Logger, store store.Storer, validate *validator.Validate) *HTTPHandler {
	return &HTTPHandler{
		logger:   logger,
		store:    store,
		validate: validate,
	}
}

func (h *HTTPHandler) SetupRoutes() *chi.Mux {
	r := chi.NewRouter()

	r.Route("/post", func(r chi.Router) {
		r.Get("/{userID}", h.handleGetUserPosts)
		r.Post("/create", h.handleCreatePost)
		r.Delete("/delete/{postID}", h.handleDeletePost)
	})

	return r
}
