package models

type GetLikedReq struct {
	Paginate
	UserID string
}

type LikedPosts struct {
	LikeID string `json:"liked_id"`
	Post
}
