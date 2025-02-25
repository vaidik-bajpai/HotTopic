package models

import "github.com/vaidik-bajpai/gopher-social/internal/db/db"

type WriteCommentReq struct {
	PostID  string
	UserID  string
	Comment string
}

type WriteReplyToCommentReq struct {
	CommentID string
	UserID    string
	ReplyText string
	ParentID  string
}

type GetCommentsRes struct {
	CommentID db.RawString `json:"comment_id"`
	UserID    db.RawString `json:"user_id"`
	Username  db.RawString `json:"username"`
	Comment   db.RawString `json:"comment"`
	Likes     db.RawBigInt `json:"comment_likes"`
	ReplyNo   db.RawBigInt `json:"total_replies"`
	UserLiked bool         `json:"user_liked_comment"`
	Replies   []ReplyRes   `json:"replies"`
}

type ReplyRes struct {
	ID        db.RawString `json:"id"`
	UserID    db.RawString `json:"user_id"`
	Username  db.RawString `json:"username"`
	Reply     db.RawString `json:"reply"`
	Likes     db.RawBigInt `json:"likes"`
	UserLiked bool         `json:"user_liked"`
}
