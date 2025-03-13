package store

import (
	"context"
	"errors"
	"log"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
)

var (
	ErrLikeNotProcessed   = errors.New("your like could not be processed")
	ErrUnLikeNotProcessed = errors.New("your unlike could not be processed")
)

func (s *Store) LikeAPost(ctx context.Context, userID string, postID string) error {
	likeModel := s.db.PostLike.CreateOne(
		db.PostLike.User.Link(
			db.User.ID.Equals(userID),
		),
		db.PostLike.Post.Link(
			db.Post.ID.Equals(postID),
		),
	).Tx()

	postModel := s.db.Post.FindUnique(
		db.Post.ID.Equals(postID),
	).Update(
		db.Post.Likes.Increment(1),
	).Tx()

	err := s.db.Prisma.Transaction(likeModel, postModel).Exec(ctx)
	if err != nil {
		log.Println(err)
		return ErrLikeNotProcessed
	}

	return nil
}

func (s *Store) UnlikeAPost(ctx context.Context, userID string, postID string) error {
	likeModel := s.db.PostLike.FindUnique(
		db.PostLike.UserIDPostID(
			db.PostLike.UserID.Equals(userID),
			db.PostLike.PostID.Equals(postID),
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
