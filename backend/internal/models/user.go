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

type ListUserReq struct {
	Paginate
	UserID     string
	SearchTerm string
}

type ListUserRes struct {
	ID          string `json:"id"`
	Userpic     string `json:"user_pic"`
	Username    string `json:"username"`
	Name        string `json:"name"`
	IsFollowing bool   `json:"is_following"`
}
