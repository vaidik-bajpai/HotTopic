package handler

import (
	"net/http"

	"go.uber.org/zap"
)

func (h *HTTPHandler) handleUserSignup(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Username string `json:"username" validate:"required.min=6,max=30"`
		Password string `json:"password" validate:"required,min=8,max=72"`
		Email    string `json:"email" validate:"required,email,checkEmail"`
	}

	if err := readJSONBody(r, payload); err != nil {
		h.logger.Error("bad request response", zap.Error(err))
		badRequestResponse(w, "could not decode user signup payload")
		return
	}

	if err := h.validate.Struct(payload); err != nil {
		h.logger.Error("invalid payload data", zap.Error(err))
		badRequestResponse(w, "invalid payload data")
		return
	}
	panic("unimplemented")
}

func (h *HTTPHandler) handleUserSignin() {
	panic("unimplemented")
}

func (h *HTTPHandler) handleForgotPassword() {
	panic("unimplemented")
}
