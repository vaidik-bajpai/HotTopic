package models

type GetFollowReq struct {
	RequesterID string
	UserID      string
	Paginate
}

type GetFollowRes struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Username    string `json:"username"`
	UserPic     string `json:"userpic"`
	IsFollowing bool   `json:"is_following"`
}
