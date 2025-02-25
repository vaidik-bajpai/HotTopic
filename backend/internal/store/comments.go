package store

import (
	"context"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

func (s *Store) WriteComment(ctx context.Context, wc *models.WriteCommentReq) error {
	_, err := s.db.Comment.CreateOne(
		db.Comment.Comment.Set(wc.Comment),
		db.Comment.User.Link(
			db.User.ID.Equals(wc.UserID),
		),
		db.Comment.Post.Link(
			db.Post.ID.Equals(wc.Comment),
		),
	).Exec(ctx)
	return err
}

func (s *Store) WriteReplyToComment(ctx context.Context, wcr *models.WriteReplyToCommentReq) error {
	_, err := s.db.Reply.CreateOne(
		db.Reply.Reply.Equals(wcr.ReplyText),
		db.Reply.User.Link(
			db.User.ID.Equals(wcr.UserID),
		),
		db.Reply.Comment.Link(
			db.Comment.ID.Equals(wcr.CommentID),
		),
	).Exec(ctx)

	return err
}

func (s *Store) GetComments(ctx context.Context, gc *models.GetCommentsReq) ([]*models.GetCommentsRes, error) {
	err := s.db.Prisma.QueryRaw("
		
	")
}
