package store

import (
	"context"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Storer interface {
	CreatePost(context.Context, *CreateUserPosts) error
	UpdatePost(context.Context, *UpdateUserPost) error
	DeletePost(context.Context, string) error
	GetPosts(int64, int64) ([]GetUserPosts, error)
}

type Store struct {
	db *pgxpool.Pool
}

func NewStore(dbpool *pgxpool.Pool) *Store {
	return &Store{db: dbpool}
}
