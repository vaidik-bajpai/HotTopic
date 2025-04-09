package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/go-chi/chi"
)

func (h *HTTPHandler) handleGetProfile(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userID")
	if err := h.validate.Var(userID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	profile, err := h.store.GetProfile(ctx, userID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.json.WriteJSONResponse(w, http.StatusOK, map[string]interface{}{"profile": profile})
}

func (h *HTTPHandler) handleCreateProfile(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

func (h *HTTPHandler) handleUpdateProfile(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}

func (h *HTTPHandler) handleGetCommentedPosts(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}
