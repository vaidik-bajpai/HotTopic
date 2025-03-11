package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

func (h *HTTPHandler) handleWriteComment(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	var payload struct {
		Comment string `json:"comment" validate:"required,min=1,max=200"`
		PostID  string `json:"post_id" validate:"required,uuid"`
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
		PostID:  payload.PostID,
		Comment: payload.Comment,
		UserID:  user.ID,
	}); err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("your comments has been posted")
	h.json.WriteJSONResponse(w, http.StatusOK, "your comments has been posted")
}

func (h *HTTPHandler) WriteReplyToAComment(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)

	var payload struct {
		Reply     string `json:"comment" validate:"required,min=1,max=200"`
		CommentID string `json:"post_id" validate:"required,uuid"`
		ParentID  string `json:"parent_id" validate:"required,uuid"`
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

	err := h.store.WriteReplyToComment(ctx, &models.WriteReplyToCommentReq{
		CommentID: payload.CommentID,
		UserID:    user.ID,
		ReplyText: payload.Reply,
		ParentID:  payload.ParentID,
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.json.WriteNoContentResponse(w)
}

/*
func (h *HTTPHandler) handleGetComments(w http.ResponseWriter, r *http.Request) {
	paginate := getPaginateFromCtx(r)
	userID := getUserFromCtx(r)

	postID := chi.URLParam(r, "postID")
	if err := h.validate.Var(postID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	h.store.GetComments(ctx, )
} */
