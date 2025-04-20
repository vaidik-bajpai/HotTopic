package store

import (
	"context"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

func (s *Store) WriteComment(ctx context.Context, wc *models.WriteCommentReq) error {
	var err error
	if wc.ParentCommentID == "" {
		_, err = s.db.Comment.CreateOne(
			db.Comment.Message.Set(wc.Comment),
			db.Comment.User.Link(
				db.User.ID.Equals(wc.UserID),
			),
			db.Comment.Post.Link(
				db.Post.ID.Equals(wc.PostID),
			),
		).Exec(ctx)

		return err
	}
	replyTxn := s.db.Comment.CreateOne(
		db.Comment.Message.Set(wc.Comment),
		db.Comment.User.Link(
			db.User.ID.Equals(wc.UserID),
		),
		db.Comment.Post.Link(
			db.Post.ID.Equals(wc.PostID),
		),
		db.Comment.Parent.Link(
			db.Comment.ID.Equals(wc.ParentCommentID),
		),
	).Tx()

	replyIncTxn := s.db.Comment.FindUnique(
		db.Comment.ID.Equals(wc.ParentCommentID),
	).Update(
		db.Comment.Replies.Increment(1),
	).Tx()

	err = s.db.Prisma.Transaction(replyTxn, replyIncTxn).Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) GetComments(ctx context.Context, gc *models.GetCommentsReq) ([]*models.GetCommentsRes, error) {
	query := s.db.Comment.FindMany(
		db.Comment.PostID.Equals(gc.PostID),
	).With(
		db.Comment.Parent.Fetch().With(
			db.Comment.User.Fetch(),
		),
		db.Comment.User.Fetch(),
		db.Comment.Like.Fetch(db.CommentLike.UserID.Equals(gc.RequesterID)),
	).Take(int(gc.PageSize)).OrderBy(
		db.Comment.CreatedAt.Order(db.ASC),
	)

	if gc.LastID != "" {
		query = query.Cursor(db.Comment.ID.Cursor(gc.LastID)).Skip(1)
	}

	comments, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	var res []*models.GetCommentsRes
	for _, comment := range comments {
		var parentUserID, parentUsername string

		parentComment, hasParent := comment.Parent()
		if hasParent && parentComment != nil {
			user := parentComment.User()
			parentUserID = user.ID
			parentUsername = user.Username
		}

		isLiked := len(comment.Like()) > 0

		res = append(res, &models.GetCommentsRes{
			ID:               comment.ID,
			UserID:           comment.UserID,
			Username:         comment.User().Username,
			Comment:          comment.Message,
			Likes:            int64(comment.Likes),
			Replies:          int64(comment.Replies),
			ParentAuthorID:   parentUserID,
			ParentAuthorName: parentUsername,
			IsLiked:          isLiked,
		})
	}

	return res, nil
}

func (s *Store) LikeAComment(ctx context.Context, lc *models.LikeCommentReq) error {
	likeTxn := s.db.CommentLike.CreateOne(
		db.CommentLike.User.Link(
			db.User.ID.Equals(lc.UserID),
		),
		db.CommentLike.Comment.Link(
			db.Comment.ID.Equals(lc.CommentID),
		),
	).Tx()

	likeIncTxn := s.db.Comment.FindMany(
		db.Comment.ID.Equals(lc.CommentID),
	).Update(
		db.Comment.Likes.Increment(1),
	).Tx()
	if err := s.db.Prisma.Transaction(likeTxn, likeIncTxn).Exec(ctx); err != nil {
		return err
	}

	return nil
}
