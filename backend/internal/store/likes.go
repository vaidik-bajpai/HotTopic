package store

import (
	"context"
	"errors"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
)

var (
	ErrLikeNotProcessed   = errors.New("your like could not be processed")
	ErrUnLikeNotProcessed = errors.New("your unlike could not be processed")
)

func (s *Store) LikeAPost(ctx context.Context, userID string, postID string) error {
	likeModel := s.db.Like.CreateOne(
		db.Like.TargetID.Equals(postID),
		db.Like.Type.Equals(db.LikeTypePost),
		db.Like.User.Link(
			db.User.ID.Equals(userID),
		),
	).Tx()

	postModel := s.db.Post.FindUnique(
		db.Post.ID.Equals(postID),
	).Update(
		db.Post.Likes.Increment(1),
	).Tx()

	err := s.db.Prisma.Transaction(likeModel, postModel).Exec(ctx)
	if err != nil {
		return ErrLikeNotProcessed
	}

	return nil
}

func (s *Store) UnlikeAPost(ctx context.Context, userID string, postID string) error {
	likeModel := s.db.Like.FindUnique(
		db.Like.UserIDTargetIDType(
			db.Like.UserID.Equals(userID),
			db.Like.TargetID.Equals(postID),
			db.Like.Type.Equals(db.LikeTypePost),
		),
	).Delete().Tx()

	postModel := s.db.Post.FindUnique(
		db.Post.ID.Equals(postID),
	).Update(
		db.Post.Likes.Decrement(1),
	).Tx()

	err := s.db.Prisma.Transaction(likeModel, postModel).Exec(ctx)
	if err != nil {
		return ErrUnLikeNotProcessed
	}

	return nil
}
