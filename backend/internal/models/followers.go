package models

import "github.com/vaidik-bajpai/gopher-social/internal/db/db"

type GetFollowReq struct {
	RequesterID string
	UserID      string
	Paginate
}

type GetFollowRes struct {
	UserID      db.RawString  `json:"user_id"`
	Username    db.RawString  `json:"username"`
	IsFollowing db.RawBoolean `json:"is_following"`
}
