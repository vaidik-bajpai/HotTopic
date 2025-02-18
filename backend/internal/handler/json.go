package handler

import (
	"encoding/json"
	"net/http"
)

type envelope struct {
	Data any `json:"data"`
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(envelope{Data: data})
}

func writeError(w http.ResponseWriter, status int, err string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
}

func readJSONBody(r *http.Request, dst interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(&dst); err != nil {
		return err
	}
	return nil
}

func badRequestResponse(w http.ResponseWriter, msg string) {
	writeError(w, http.StatusBadRequest, msg)
}

func internalServerErrorResponse(w http.ResponseWriter, msg string) {
	writeError(w, http.StatusInternalServerError, msg)
}
