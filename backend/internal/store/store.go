package store

import (
	"context"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

type Storer interface {
	CreatePost(context.Context, *CreateUserPosts) error
	UpdatePost(context.Context, *UpdateUserPost) error
	DeletePost(context.Context, string) error
	GetPosts(context.Context, int64, int64, string) ([]GetUserPosts, error)

	UserRegistration(context.Context, *User) (*models.Token, error)
	UserViaEmail(context.Context, string) (*User, error)

	CreateForgotPasswordToken(context.Context, *models.Token) error
	GetUserFromToken(context.Context, *models.Token) error
	ResetPassword(context.Context, *models.ResetPassword) error
	GetTokenModel(ctx context.Context, tokenHash []byte) (*models.Token, error)
	ActivateUser(ctx context.Context, userID string) error
}

type Store struct {
	db *db.PrismaClient
}

func NewStore(db *db.PrismaClient) *Store {
	return &Store{db: db}
}
