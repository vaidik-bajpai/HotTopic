package models

type GetSavedReq struct {
	Paginate
	UserID string
}

type SavedPosts struct {
	SavedID string `json:"saved_id"`
	Post
}
