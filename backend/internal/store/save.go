package store

import (
	"context"
	"errors"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
)

var (
	ErrAlreadySaved  = errors.New("post has already been saved by the user")
	ErrNotASavedPost = errors.New("the post or user does not exists")
)

func (s *Store) SavePost(ctx context.Context, userID string, postID string) error {
	_, err := s.db.Save.CreateOne(
		db.Save.User.Link(
			db.User.ID.Equals(userID),
		),
		db.Save.Post.Link(
			db.Post.ID.Equals(postID),
		),
	).Exec(ctx)
	if err != nil {
		if _, ok := db.IsErrUniqueConstraint(err); ok {
			return ErrAlreadySaved
		}
		return err
	}

	return nil
}

func (s *Store) UnSavePost(ctx context.Context, userID, postID string) error {
	_, err := s.db.Save.FindUnique(
		db.Save.UserIDPostID(
			db.Save.UserID.Equals(userID),
			db.Save.PostID.Equals(postID),
		),
	).Delete().Exec(ctx)
	if err != nil {
		if ok := db.IsErrNotFound(err); ok {
			return ErrNotASavedPost
		}
		return err
	}

	return nil
}
