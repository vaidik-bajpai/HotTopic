package models

type WriteCommentReq struct {
	PostID          string
	UserID          string
	Comment         string
	ParentCommentID string
}

type WriteReplyToCommentReq struct {
	CommentID string
	UserID    string
	ReplyText string
	ParentID  string
}

type GetCommentsReq struct {
	Paginate
	RequesterID string
	PostID      string
}

type GetCommentsRes struct {
	ID               string `json:"id"`
	UserID           string `json:"user_id"`
	Username         string `json:"username"`
	Comment          string `json:"comment"`
	Likes            int64  `json:"likes"`
	Replies          int64  `json:"replies"`
	ParentAuthorID   string `json:"parent_author_id"`
	ParentAuthorName string `json:"parent_author_name"`
	IsLiked          bool   `json:"is_likes"`
}

type LikeCommentReq struct {
	UserID    string
	CommentID string
}
