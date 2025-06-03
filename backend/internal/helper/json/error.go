package json

import (
	"net/http"

	"go.uber.org/zap"
)

func (j *JSON) logError(r *http.Request, message string, err string) {
	j.logger.Error(
		message,
		zap.String("request_method", r.Method),
		zap.String("request_url", r.URL.String()),
		zap.String("error", err),
	)
}

func (j *JSON) errorResponse(w http.ResponseWriter, r *http.Request, status int, message interface{}) {
	env := map[string]interface{}{"error": message}

	err := j.WriteJSONResponse(w, status, env)
	if err != nil {
		j.logError(r, "error occurred", err.Error())
		w.WriteHeader(500)
	}
}

func (j *JSON) BadRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	j.logError(r, "bad request", err.Error())
	j.errorResponse(w, r, http.StatusBadRequest, err.Error())
}

func (j *JSON) ServerErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	j.logError(r, "internal server error", err.Error())
	message := "the server encountered a problem and could not process your request"
	j.errorResponse(w, r, http.StatusInternalServerError, message)
}

func (j *JSON) InvalidCredentialsResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := "invalid authentication credentials"
	j.logError(r, message, err.Error())
	j.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (j *JSON) FailedValidationResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := "invalid request payload"
	j.logError(r, message, err.Error())
	j.errorResponse(w, r, http.StatusBadRequest, message)
}

func (j *JSON) UnauthorizedResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := "you are unauthorized to access this resource"
	j.logError(r, message, err.Error())
	j.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (j *JSON) InvalidTokenResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := "provided token is invalid"
	j.logError(r, message, err.Error())
	j.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (j *JSON) TokenExpiredResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := "your token has expired"
	j.logError(r, message, err.Error())
	j.errorResponse(w, r, http.StatusUnauthorized, message)
}

func (j *JSON) ConflictResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := err.Error()
	j.logError(r, message, message)
	j.errorResponse(w, r, http.StatusConflict, message)
}

func (j *JSON) ForbiddenResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := err.Error()
	j.logError(r, message, message)
	j.errorResponse(w, r, http.StatusForbidden, message)
}

func (j *JSON) NotFoundResponse(w http.ResponseWriter, r *http.Request, err error) {
	message := err.Error()
	j.logError(r, message, message)
	j.errorResponse(w, r, http.StatusNotFound, message)
}
