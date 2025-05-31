package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/models"
	"go.uber.org/zap"
)

func (h *HTTPHandler) handleSavePost(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)

	postID := chi.URLParam(r, "postID")
	if err := h.validate.Var(postID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.SavePost(ctx, user.ID, postID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("post has been saved successfully", zap.String("user id", user.ID), zap.String("post ID", postID))
	h.json.WriteNoContentResponse(w)
}

func (h *HTTPHandler) handleUnsavePost(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)

	postID := chi.URLParam(r, "postID")
	if err := h.validate.Var(postID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.UnSavePost(ctx, user.ID, postID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("post has been unsaved successfully", zap.String("user id", user.ID), zap.String("post ID", postID))
	h.json.WriteNoContentResponse(w)
}

func (h *HTTPHandler) handleGetSavedPosts(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	paginate := getPaginateFromCtx(r)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	posts, err := h.store.GetSavedPost(ctx, &models.GetSavedReq{
		Paginate: models.Paginate{
			PageSize: paginate.PageSize,
			LastID:   paginate.LastID,
		},
		UserID: user.ID,
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("successfully fetched the posts")
	h.json.WriteJSONResponse(w, http.StatusOK, map[string][]*models.Post{"posts": posts})
}
