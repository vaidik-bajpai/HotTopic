package models

type ResetPassword struct {
	NewPasswordHash []byte `validate:"required"`
	UserID          string `validate:"required,uuid"`
}

type ActivateUser struct {
	Token  string
	UserID string
}

type UserProfile struct {
	UserID         string   `json:"user_id"`
	Username       string   `json:"username"`
	UserPic        string   `json:"userpic"`
	Bio            string   `json:"bio"`
	Pronouns       []string `json:"pronouns"`
	TotalPosts     int64    `json:"post_count"`
	TotalFollowers int64    `json:"followers_count"`
	TotalFollowing int64    `json:"following_count"`
}
