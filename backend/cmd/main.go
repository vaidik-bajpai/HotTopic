package main

import (
	_ "embed"
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
	_ "github.com/joho/godotenv/autoload"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/cache"
	database "github.com/vaidik-bajpai/HotTopic/backend/internal/db"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/handler"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/helper"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/helper/json"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/mailer"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/store"
	"go.uber.org/zap"
)

//go:generate go run github.com/steebchen/prisma-client-go generate --schema ../internal/db/schema.prisma

func main() {
	redisConnURL := helper.GetEnvOrPanic("REDIS_URL")
	sgAPIKey := helper.GetEnvOrPanic("SENDGRID_API_KEY")
	sgfromEmail := helper.GetEnvOrPanic("SENDGRID_FROM_EMAIL")

	/* cfg := zap.NewProductionConfig()
	cfg.EncoderConfig.TimeKey = "ts"
	cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	cfg.DisableStacktrace = true // Disable stack traces */

	logger, _ := zap.NewProduction()
	defer logger.Sync()

	validate := validator.New()
	validate.RegisterValidation("checkEmail", CheckEmail)
	validate.RegisterValidation("base32", Base32)

	prismaClient, err := database.NewPrismaClient()
	if err != nil {
		panic(err)
	}
	defer prismaClient.Prisma.Disconnect()

	store := store.NewStore(prismaClient)

	redisClient, err := cache.NewRedisClient(redisConnURL)
	if err != nil {
		panic(err)
	}

	json := json.NewJSON(logger)

	sendGridMailer := mailer.NewSendGridMailer(sgAPIKey, sgfromEmail)

	hdl := handler.NewHandler(logger, store, validate, redisClient, json, sendGridMailer)
	r := hdl.SetupRoutes()

	fmt.Printf("Starting server on port: %s\n", "3000")
	http.ListenAndServe(":3000", r)
}

func CheckEmail(fl validator.FieldLevel) bool {
	email := fl.Field()

	emailParts := strings.Split(email.String(), "@")
	if len(emailParts[0]) > 64 {
		return false
	}

	if len(emailParts[1]) > 255 {
		return false
	}

	return true
}

func Base32(fl validator.FieldLevel) bool {
	base32Regex := regexp.MustCompile(`^[A-Z2-7]+$`)
	return base32Regex.MatchString(fl.Field().String())
}
