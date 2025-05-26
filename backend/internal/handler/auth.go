package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi"
	"github.com/vaidik-bajpai/gopher-social/internal/helper"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
	"go.uber.org/zap"
)

func (h *HTTPHandler) handleUserSignup(w http.ResponseWriter, r *http.Request) {
	var temp struct {
		Username string `json:"username" validate:"required,min=3,max=30"`
		Password string `json:"password" validate:"required,min=8,max=72"`
		Email    string `json:"email" validate:"required,email,checkEmail"`
	}

	if err := h.json.ReadJSON(w, r, &temp); err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	if err := h.validate.Struct(temp); err != nil {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	payload := &store.User{
		Username: temp.Username,
		Email:    temp.Email,
		Password: store.NewPassword(temp.Password),
	}

	token, err := h.store.UserRegistration(ctx, payload)
	if err != nil {
		if strings.Contains(err.Error(), "P2002") {
			h.json.ConflictResponse(w, r, errors.New("email or username already registered"))
			return
		}

		h.json.ServerErrorResponse(w, r, err)
		return
	}

	err = h.mailer.SendActivationEmail(payload, token.Plaintext)
	if err != nil {
		h.logger.Error("could not send activation mail")
		h.json.WriteJSONResponse(w, http.StatusInternalServerError, "Could not send activation email, Please try again later.")
		return
	}

	h.logger.Info("user signed up", zap.String("email", payload.Email))
	h.json.WriteJSONResponse(w, http.StatusCreated, payload)
}

func (h *HTTPHandler) handleUserSignin(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Email    string `json:"email" validate:"required,email,checkEmail"`
		Password string `json:"password" validate:"required,min=8,max=72"`
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

	user, err := h.store.UserViaEmail(ctx, payload.Email)
	if err != nil {
		if err == store.ErrUserNotFound {
			h.json.UnauthorizedResponse(w, r, err)
			return
		}
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	ok, err := user.Password.MatchHash(payload.Password)
	if !ok || err != nil {
		h.json.InvalidCredentialsResponse(w, r, err)
		return
	}

	sessionID := fmt.Sprintf("session:%s", user.ID)

	expirationTime := 3 * time.Hour

	userJSON, err := json.Marshal(user) // Convert struct to JSON
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	err = h.redisClient.Set(ctx, sessionID, userJSON, expirationTime).Err()
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	cookie := &http.Cookie{
		Name:     "hottopic-auth",
		Value:    sessionID,
		Path:     "/",
		Expires:  time.Now().Add(expirationTime),
		MaxAge:   int(expirationTime.Seconds()),
		HttpOnly: true,
		Secure:   false, // Set to true in production
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, cookie)

	h.logger.Info("login successfull")
	h.json.WriteJSONResponse(w, http.StatusOK, map[string]string{"id": user.ID})
}

func (h *HTTPHandler) handleUserLogout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("hottopic-auth")
	if err != nil {
		h.json.UnauthorizedResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = h.redisClient.Del(ctx, cookie.Value).Err()
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "hottopic-auth",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false, // ⬅️ false in dev
		SameSite: http.SameSiteLaxMode,
	})

	h.logger.Info("user logged successfully")
	h.json.WriteJSONResponse(w, http.StatusOK, "user logged out successfully!")
}

func (h *HTTPHandler) handleUserActivation(w http.ResponseWriter, r *http.Request) {
	t := chi.URLParam(r, "token")
	err := h.validate.Var(t, "required,len=26,base32")
	if err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	user := getUserFromCtx(r)
	token := getTokenFromCtx(r)

	if token.UserID != user.ID {
		h.json.FailedValidationResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = h.store.ActivateUser(ctx, token.UserID)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("email activated")
	h.json.WriteJSONResponse(w, http.StatusOK, "email activated")
}

func (h *HTTPHandler) handleForgotPassword(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Email string `json:"email" validate:"required,email,checkEmail"`
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

	user, err := h.store.UserViaEmail(ctx, payload.Email)
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	token, err := helper.GenerateToken(user.ID, 10*time.Minute)
	if err != nil {
		h.logger.Error("could not generate the forgot password token", zap.String("email", payload.Email), zap.Error(err))
		h.json.WriteJSONResponse(w, http.StatusInternalServerError, "could not generate the token")
		return
	}

	token.UserID = user.ID

	err = h.store.CreateForgotPasswordToken(ctx, token)
	if err != nil {
		h.logger.Error("could not create the forgot password token", zap.String("email", payload.Email), zap.Error(err))
		h.json.WriteJSONResponse(w, http.StatusInternalServerError, "could not create the token")
		return
	}

	err = h.mailer.SendForgotPasswordEmail(user, token.Plaintext)
	if err != nil {
		h.logger.Info("could not send the forgot password mail", zap.String("email", user.Email), zap.Error(err))
		h.json.WriteJSONResponse(w, http.StatusInternalServerError, "could not send the forgot password mail.")
		return
	}

	h.logger.Info("email sent successfully!")
	h.json.WriteJSONResponse(w, http.StatusOK, map[string]string{
		"message": "an email has been sent to your accound",
		"email":   payload.Email,
	})
}

func (h *HTTPHandler) handleResetPassword(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Token           string `json:"-" validate:"required,len=26"`
		NewPassword     string `json:"new_password" validate:"required,min=8,max=72"`
		ConfirmPassword string `json:"confirm_password" validate:"required,min=8,max=72"`
	}

	if err := h.json.ReadJSON(w, r, &payload); err != nil {
		h.json.BadRequestResponse(w, r, err)
		return
	}

	if payload.NewPassword != payload.ConfirmPassword {
		h.logger.Info("confirm password does not match new password", zap.String("new_password", payload.NewPassword), zap.String("confirm_password", payload.ConfirmPassword))
		h.json.WriteJSONResponse(w, http.StatusBadRequest, "confirm password does not match new password")
		return
	}

	password := store.NewPassword(payload.NewPassword)
	err := password.MakeHash()
	if err != nil {
		h.json.InvalidCredentialsResponse(w, r, err)
		return
	}

	token := getTokenFromCtx(r)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = h.store.ResetPassword(ctx, &models.ResetPassword{NewPasswordHash: password.Hash, UserID: token.UserID})
	if err != nil {
		h.json.ServerErrorResponse(w, r, err)
		return
	}

	h.logger.Info("the password has been changed successfully")
	h.json.WriteJSONResponse(w, http.StatusOK, "your password has been changed")
}
