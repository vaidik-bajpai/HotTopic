package handler

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/go-playground/validator/v10"
	"github.com/redis/go-redis/v9"
	"github.com/vaidik-bajpai/gopher-social/internal/helper"
	"github.com/vaidik-bajpai/gopher-social/internal/helper/json"
	"github.com/vaidik-bajpai/gopher-social/internal/mailer"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
	"go.uber.org/zap"
)

type HTTPHandler struct {
	logger      *zap.Logger
	store       store.Storer
	validate    *validator.Validate
	redisClient *redis.Client
	json        *json.JSON
	mailer      mailer.Mailer
	limiters    map[string]func(http.Handler) http.Handler
}

func NewHandler(logger *zap.Logger, store store.Storer, validate *validator.Validate, redisClient *redis.Client, json *json.JSON, mailer mailer.Mailer) *HTTPHandler {
	h := &HTTPHandler{
		logger:      logger,
		store:       store,
		validate:    validate,
		redisClient: redisClient,
		json:        json,
		mailer:      mailer,
		limiters:    make(map[string]func(http.Handler) http.Handler),
	}

	// Pre-create commonly used rate limiters
	h.limiters["auth:20-M"] = h.rateLimit("10-M", "auth", true)
	h.limiters["post:60-M"] = h.rateLimit("20-M", "post", true)
	h.limiters["user:60-M"] = h.rateLimit("20-M", "user", true)
	h.limiters["forgot-resend:3-H"] = h.rateLimit("3-H", "forgot-resend", true)
	return h
}

func (h *HTTPHandler) SetupRoutes() *chi.Mux {
	r := chi.NewRouter()

	frontend := helper.GetEnvOrPanic("FRONTEND_ORIGIN")
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{frontend},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Post routes: Authenticate -> Rate Limit -> Activated
	r.Route("/post", func(r chi.Router) {
		r.Use(h.authenticate)
		r.Use(h.limiters["post:60-M"])
		r.Use(h.activated)

		r.Post("/create", h.handleCreatePost)

		r.Route("/{postID}", func(r chi.Router) {
			r.Post("/like", h.handleLikeAPost)
			r.Post("/unlike", h.handleUnlikeAPost)
			r.Post("/save", h.handleSavePost)
			r.Post("/unsave", h.handleUnsavePost)
			r.With(h.onlyMe).Delete("/delete", h.handleDeletePost)
		})

		r.Route("/comment", func(r chi.Router) {
			r.Post("/", h.handleWriteComment)

			r.Route("/{commentID}", func(r chi.Router) {
				r.Post("/", h.handleLikeComment)
			})

			r.With(h.paginate).Get("/{postID}", h.handleGetComments)
		})

		r.With(h.canAccess, h.paginate).Get("/{userID}", h.handleGetUserPosts)
		r.With(h.paginate).Get("/saved", h.handleGetSavedPosts)
		r.With(h.paginate).Get("/liked", h.handleGetLikedPosts)
	})

	// User routes: Authenticate -> Rate Limit -> Activated
	r.Route("/user", func(r chi.Router) {
		r.Use(h.authenticate)
		r.Use(h.limiters["user:60-M"])
		r.Use(h.activated)

		r.With(h.paginate).Get("/feed", h.handleGetUserFeed)
		r.With(h.paginate).Get("/list", h.handleGetUser)

		r.Route("/{userID}", func(r chi.Router) {
			r.Post("/follow", h.handleFollowUser)
			r.Post("/unfollow", h.handleUnFollowUser)
			r.With(h.canAccess, h.paginate).Get("/followers", h.handleGetFollowers)
			r.With(h.canAccess, h.paginate).Get("/followings", h.handleGetFollowing)
		})

		r.Route("/profile", func(r chi.Router) {
			r.Get("/{userID}", h.handleGetProfile)
			r.Put("/", h.handleUpdateProfile)
		})
	})

	// Auth routes: Rate Limited
	r.Route("/auth", func(r chi.Router) {
		// No rate limiter globally here

		// Rate limiter for unauthenticated routes (fallback to IP):
		r.With(h.limiters["auth:20-M"]).Post("/signup", h.handleUserSignup)
		r.With(h.limiters["auth:20-M"]).Post("/signin", h.handleUserSignin)
		r.With(h.limiters["auth:20-M"]).Post("/logout", h.handleUserLogout)

		r.With(h.limiters["forgot-resend:3-H"]).Post("/forgot-password", h.handleForgotPassword)
		r.With(h.limiters["forgot-resend:3-H"]).Post("/resend-activation", h.handleResendActivation)

		// Authenticated routes get authenticate then rate limiter
		r.With(h.authenticate, h.limiters["auth:20-M"], h.activated).Get("/me", h.handleGetMe)
		r.With(h.tokenChecker).Post("/activate/{token}", h.handleUserActivation)
		r.With(h.tokenChecker).Post("/reset-password/{token}", h.handleResetPassword)
	})

	return r
}
