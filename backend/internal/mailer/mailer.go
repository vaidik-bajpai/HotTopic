package mailer

import "github.com/vaidik-bajpai/HotTopic/backend/internal/store"

type Mailer interface {
	SendActivationEmail(u *store.User, token string) error
	SendForgotPasswordEmail(u *store.User, token string) error
}
