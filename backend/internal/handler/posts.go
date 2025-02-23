package handler

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
	"go.uber.org/zap"
)

func (h *HTTPHandler) handleGetUserPosts(w http.ResponseWriter, r *http.Request) {
	sizeStr := r.URL.Query().Get("size")
	pageSize, err := strconv.ParseInt(sizeStr, 10, 64)
	if err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	offsetStr := r.URL.Query().Get("offset")
	offset, err := strconv.ParseInt(offsetStr, 10, 64)
	if err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	userID := r.URL.Query().Get("user_id")
	if err = h.validate.Var(userID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	posts, err := h.store.GetPosts(ctx, pageSize, offset, "1")
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("successfully fetched the posts")
	h.json.WriteJSONResponse(w, http.StatusOK, map[string][]store.GetUserPosts{"posts": posts})
}

func (h *HTTPHandler) handleGetUserFeed(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

func (h *HTTPHandler) handleCreatePost(w http.ResponseWriter, r *http.Request) {
	var payload store.CreateUserPosts
	if err := h.json.ReadJSON(w, r, &payload); err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	if err := h.validate.Struct(payload); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.CreatePost(ctx, &payload)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("post successfully created", zap.Any("payload", payload))
	h.json.WriteJSONResponse(w, http.StatusOK, payload)
}

func (h *HTTPHandler) handleUpdatePost(w http.ResponseWriter, r *http.Request) {
	var payload store.UpdateUserPost
	if err := h.json.ReadJSON(w, r, payload); err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	if err := h.validate.Struct(payload); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := h.store.UpdatePost(ctx, &payload)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("successfully updated the post", zap.Any("payload", payload))
	h.json.WriteJSONResponse(w, http.StatusOK, payload)
}

func (h *HTTPHandler) handleDeletePost(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "post_id")
	err := h.validate.Var(postID, "required,uuid")
	if err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = h.store.DeletePost(ctx, postID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("successfully deleted the post", zap.String("post id", postID))
	h.json.WriteJSONResponse(w, http.StatusOK, "successfully deleted the post")
}
