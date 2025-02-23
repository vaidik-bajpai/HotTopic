package models

type ResetPassword struct {
	NewPasswordHash []byte `validate:"required"`
	UserID          string `validate:"required,uuid"`
}

type ActivateUser struct {
	Token  string
	UserID string
}
