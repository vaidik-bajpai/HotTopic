package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"go.uber.org/zap"
)

func (h *HTTPHandler) handleWriteComment(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	var payload struct {
		Comment         string `json:"comment" validate:"required,min=1,max=200"`
		PostID          string `json:"post_id" validate:"required,uuid"`
		ParentCommentID string `json:"parent_comment_id" validate:"omitempty,uuid"`
	}

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

	if err := h.store.WriteComment(ctx, &models.WriteCommentReq{
		PostID:          payload.PostID,
		Comment:         payload.Comment,
		UserID:          user.ID,
		ParentCommentID: payload.ParentCommentID,
	}); err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("your comments has been posted")
	h.json.WriteJSONResponse(w, http.StatusOK, "your comments has been posted")
}

func (h *HTTPHandler) handleGetComments(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	paginate := getPaginateFromCtx(r)
	h.logger.Info("paginate context data", zap.Any("data", paginate))
	postID := chi.URLParam(r, "postID")
	if err := h.validate.Var(postID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	comments, err := h.store.GetComments(ctx, &models.GetCommentsReq{
		RequesterID: user.ID,
		PostID:      postID,
		Paginate:    *paginate,
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("comments have been fetched successfully")
	h.json.WriteJSONResponse(w, http.StatusOK, map[string][]*models.GetCommentsRes{"comments": comments})
}

func (h *HTTPHandler) handleLikeComment(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	commentID := chi.URLParam(r, "commentID")
	if err := h.validate.Var(commentID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.LikeAComment(ctx, &models.LikeCommentReq{
		UserID:    user.ID,
		CommentID: commentID,
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("comments have been fetched successfully")
	h.json.WriteNoContentResponse(w)
}
