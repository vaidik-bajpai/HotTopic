package handler

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"go.uber.org/zap"
)

func (h *HTTPHandler) handleGetProfile(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	userID := chi.URLParam(r, "userID")

	if err := h.validate.Var(userID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	profile, err := h.store.GetProfile(ctx, &models.GetProfileReq{
		UserID:      userID,
		RequesterID: user.ID,
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	if profile.UserID == user.ID {
		profile.IsSelf = true
	}

	h.json.WriteJSONResponse(w, http.StatusOK, map[string]interface{}{"profile": profile})
}

func (h *HTTPHandler) handleGetUser(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	paginate := getPaginateFromCtx(r)

	searchTerm := strings.TrimSpace(r.URL.Query().Get("search_term"))
	if searchTerm == "" {
		fmt.Println("searchTerm: ", searchTerm)
		h.json.FailedValidationResponse(w, r, errors.New("searchTerm cannot be empty"))
		return
	}

	if err := h.validate.Var(searchTerm, "required"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	list, err := h.store.ListUsers(ctx, &models.ListUserReq{
		Paginate:   *paginate,
		SearchTerm: searchTerm,
		UserID:     user.ID,
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.json.WriteJSONResponse(w, http.StatusOK, map[string]interface{}{"results": list})
}

func (h *HTTPHandler) handleUpdateProfile(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	var req *models.UpdateProfile
	if err := h.json.ReadJSON(w, r, &req); err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	req.UserID = user.ID

	if err := h.validate.Struct(req); err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.UpdateProfile(ctx, req)
	if err != nil {
		if _, ok := db.IsErrUniqueConstraint(err); ok {
			h.json.ConflictResponse(w, r, errors.New("username taken"))
			return
		}
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("user updated successfully", zap.String("username", user.Username))
	h.json.WriteNoContentResponse(w)
}

func (h *HTTPHandler) handleGetCommentedPosts(w http.ResponseWriter, r *http.Request) {
	panic("unimplemented")
}
