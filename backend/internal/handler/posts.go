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
		h.logger.Error("invalid page size", zap.Error(err))
		badRequestResponse(w, "invalid page size")
		return
	}

	offsetStr := r.URL.Query().Get("offset")
	offset, err := strconv.ParseInt(offsetStr, 10, 64)
	if err != nil {
		h.logger.Error("invalid page size", zap.Error(err))
		badRequestResponse(w, "invalid page size")
		return
	}

	userID := r.URL.Query().Get("user_id")
	if err = h.validate.Var(userID, "required,uuid"); err != nil {
		h.logger.Error("invalid userID", zap.Error(err))
		badRequestResponse(w, "invalid userID")
		return
	}

	posts, err := h.store.GetPosts(pageSize, offset)
	if err != nil {
		h.logger.Error("something went wrong while fetching the posts")
		internalServerErrorResponse(w, "something went wrong while fetching the posts")
		return
	}

	h.logger.Info("successfully fetched the posts")
	writeJSON(w, http.StatusOK, map[string][]store.GetUserPosts{"posts": posts})
}

func (h *HTTPHandler) handleGetUserFeed(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

func (h *HTTPHandler) handleCreatePost(w http.ResponseWriter, r *http.Request) {
	var payload store.CreateUserPosts
	if err := readJSONBody(r, &payload); err != nil {
		h.logger.Error("error decoding the create user payload", zap.Any("payload", payload))
		writeJSON(w, http.StatusBadRequest, payload)
		return
	}

	if err := h.validate.Struct(payload); err != nil {
		h.logger.Error("error invalid create user payload", zap.Any("payload", payload))
		writeJSON(w, http.StatusBadRequest, payload)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.CreatePost(ctx, &payload)
	if err != nil {
		h.logger.Error("error while creating post", zap.Any("payload", payload))
		writeJSON(w, http.StatusInternalServerError, payload)
		return
	}

	h.logger.Info("post successfully created", zap.Any("payload", payload))
	writeJSON(w, http.StatusCreated, payload)
}

func (h *HTTPHandler) handleUpdatePost(w http.ResponseWriter, r *http.Request) {
	var payload store.UpdateUserPost
	if err := readJSONBody(r, payload); err != nil {
		h.logger.Error("error while decoding the update post payload", zap.Any("payload", payload))
		badRequestResponse(w, "could not decode the payload")
		return
	}

	if err := h.validate.Struct(payload); err != nil {
		h.logger.Error("invalid update post payload", zap.Any("payload", payload))
		badRequestResponse(w, "ill formed request payload")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := h.store.UpdatePost(ctx, &payload)
	if err != nil {
		h.logger.Error("something went wrong during the update post", zap.Any("payload", payload))
		internalServerErrorResponse(w, "something went wrong during the update post")
		return
	}

	h.logger.Info("successfully updated the post", zap.Any("payload", payload))
	writeJSON(w, http.StatusOK, payload)
}

func (h *HTTPHandler) handleDeletePost(w http.ResponseWriter, r *http.Request) {
	postID := chi.URLParam(r, "post_id")
	err := h.validate.Var(postID, "required,uuid")
	if err != nil {
		h.logger.Error("invalid post id sent to delete post", zap.Any("post id", postID))
		badRequestResponse(w, "invalid post id sent to delete post")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = h.store.DeletePost(ctx, postID)
	if err != nil {
		h.logger.Error("something went wrong while deleting the post", zap.Error(err))
		internalServerErrorResponse(w, "something went wrong while deleting the post")
		return
	}

	h.logger.Info("successfully deleted the post", zap.String("post id", postID))
	writeJSON(w, http.StatusOK, "successfully deleted the post")
}
