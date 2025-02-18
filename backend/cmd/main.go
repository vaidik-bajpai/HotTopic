package main

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/vaidik-bajpai/gopher-social/internal/handler"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	validate := validator.New()

	hdl := handler.NewHandler(logger, &store.Store{}, validate)
	r := hdl.SetupRoutes()

	fmt.Printf("Starting server on port: %s\n", "3000")
	http.ListenAndServe(":3000", r)
}
