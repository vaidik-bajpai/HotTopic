package handler

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"go.uber.org/zap"
	"golang.org/x/net/context"
)

func (h *HTTPHandler) handleFollowUser(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	followID := chi.URLParam(r, "userID")

	if err := h.validate.Var(followID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.FollowUser(ctx, user.ID, followID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("you are now following the user", zap.String("follow ID", followID))
	h.json.WriteJSONResponse(w, http.StatusOK, "you are now following the user")
}

func (h *HTTPHandler) handleUnFollowUser(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)

	unFollowID := chi.URLParam(r, "userID")
	if err := h.validate.Var(unFollowID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := h.store.UnFollowUser(ctx, user.ID, unFollowID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("you have unfollowed the user", zap.String("unfollowed user id", unFollowID))
	h.json.WriteJSONResponse(w, http.StatusOK, "you have unfollowed the user")
}

func (h *HTTPHandler) handleGetFollowers(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	paginate := getPaginateFromCtx(r)

	userID := chi.URLParam(r, "userID")
	if err := h.validate.Var(userID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	followerList, err := h.store.GetFollowerList(ctx, &models.GetFollowReq{
		RequesterID: user.ID,
		UserID:      userID,
		Paginate: models.Paginate{
			PageNo:   paginate.PageNo,
			PageSize: paginate.PageSize,
		},
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("follower list fetched successfully")
	h.json.WriteJSONResponse(w, http.StatusOK, followerList)
}

func (h *HTTPHandler) handleGetFollowing(w http.ResponseWriter, r *http.Request) {
	user := getUserFromCtx(r)
	paginate := getPaginateFromCtx(r)

	userID := chi.URLParam(r, "userID")
	if err := h.validate.Var(userID, "required,uuid"); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	followingList, err := h.store.GetFollowingList(ctx, &models.GetFollowReq{
		RequesterID: user.ID,
		UserID:      userID,
		Paginate: models.Paginate{
			PageNo:   paginate.PageNo,
			PageSize: paginate.PageSize,
		},
	})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("following list fetched successfully")
	h.json.WriteJSONResponse(w, http.StatusOK, followingList)
}
