package models

type Post struct {
	ID           string   `json:"id"`
	UserID       string   `json:"user_id"`
	Username     string   `json:"username"`
	UserPic      string   `json:"userpic"`
	Media        []string `json:"media"`
	Caption      string   `json:"caption"`
	LikeCount    int64    `json:"like_count"`
	CommentCount int64    `json:"comment_count"`
	IsLiked      bool     `json:"is_liked"`
	IsSaved      bool     `json:"is_saved"`
}

type GetPostReq struct {
	Paginate
	UserID      string
	RequesterID string
}

type PostModel struct {
	ID           string `json:"id"`
	UserID       string `json:"user_id"`
	Caption      string `json:"caption"`
	LikeCount    int64  `json:"like_count"`
	CommentCount int64  `json:"comment_count"`
}
