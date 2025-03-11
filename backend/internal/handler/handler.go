package handler

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/go-playground/validator/v10"
	"github.com/redis/go-redis/v9"
	"github.com/vaidik-bajpai/gopher-social/internal/helper/json"
	"github.com/vaidik-bajpai/gopher-social/internal/mailer"
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
	logger      *zap.Logger
	store       store.Storer
	validate    *validator.Validate
	redisClient *redis.Client
	json        *json.JSON
	mailer      mailer.Mailer
}

func NewHandler(logger *zap.Logger, store store.Storer, validate *validator.Validate, redisClient *redis.Client, json *json.JSON, mailer mailer.Mailer) *HTTPHandler {
	return &HTTPHandler{
		logger:      logger,
		store:       store,
		validate:    validate,
		redisClient: redisClient,
		json:        json,
		mailer:      mailer,
	}
}

func (h *HTTPHandler) SetupRoutes() *chi.Mux {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/post", func(r chi.Router) {
		r.With(h.paginate).Get("/{userID}", h.handleGetUserPosts)
		r.Post("/create", h.handleCreatePost)
		r.Delete("/delete/{postID}", h.handleDeletePost)
	})

	r.Route("/user", func(r chi.Router) {
		r.Get("/feed", h.handleGetUserFeed)
		r.Route("/profile", func(r chi.Router) {
			r.Get("/{userID}", h.handleGetProfile)
			r.Post("/", h.handleCreateProfile)
			r.Put("/", h.handleUpdateProfile)
		})
	})

	r.Route("/auth", func(r chi.Router) {
		r.Post("/signup", h.handleUserSignup)
		r.Post("/signin", h.handleUserSignin)
		r.Post("/logout", h.handleUserLogout)
		r.Post("/forgot-password", h.handleForgotPassword)

		r.With(h.authenticate, h.tokenChecker).Post("/activate/{token}", h.handleUserActivation)
		r.With(h.tokenChecker).Post("/reset-password/{token}", h.handleResetPassword)
	})

	return r
}
