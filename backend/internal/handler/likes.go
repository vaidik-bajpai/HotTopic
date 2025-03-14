package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/go-chi/chi"
)

func (h *HTTPHandler) handleLikeAPost(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)

	postID := chi.URLParam(r, "postID")
	if err := h.validate.Var(postID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.LikeAPost(ctx, user.ID, postID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.json.WriteNoContentResponse(w)
}

func (h *HTTPHandler) handleUnlikeAPost(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)

	postID := chi.URLParam(r, "postID")
	if err := h.validate.Var(postID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.UnlikeAPost(ctx, user.ID, postID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.json.WriteNoContentResponse(w)
}
