package store

import (
	"context"

	"github.com/vaidik-bajpai/HotTopic/backend/internal/db/db"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/models"
)

const DefaultUserPic = ""

type Storer interface {
	CreatePost(context.Context, *CreateUserPosts) error
	UpdatePost(context.Context, *UpdateUserPost) error
	DeletePost(context.Context, string) error
	GetPosts(context.Context, *models.GetPostReq) ([]*models.Post, error)
	GetFeed(context.Context, *models.FeedReq) ([]*models.Post, error)
	SavePost(ctx context.Context, userID string, postID string) error
	UnSavePost(ctx context.Context, userID string, postID string) error
	GetSavedPost(ctx context.Context, gs *models.GetSavedReq) ([]*models.SavedPosts, error)
	GetLikedPost(ctx context.Context, gl *models.GetLikedReq) ([]*models.LikedPosts, error)

	UserRegistration(context.Context, *User) (*models.Token, error)
	UserViaEmail(context.Context, string) (*User, error)
	ListUsers(context.Context, *models.ListUserReq) ([]*models.ListUserRes, error)

	GetProfile(ctx context.Context, gp *models.GetProfileReq) (*models.UserProfile, error)
	UpdateProfile(ctx context.Context, up *models.UpdateProfile) error

	CreateForgotPasswordToken(context.Context, *models.Token) error
	GetUserFromToken(context.Context, *models.Token) error
	ResetPassword(context.Context, *models.ResetPassword) error
	GetTokenModel(ctx context.Context, tokenHash []byte) (*models.Token, error)
	CreateToken(ctx context.Context, token *models.Token, scope string) error
	ActivateUser(ctx context.Context, userID string) error

	IsFollower(ctx context.Context, followerID string, followingID string) error
	FollowUser(ctx context.Context, followerID string, followingID string) error
	UnFollowUser(ctx context.Context, followerID, unFollowedID string) error
	GetFollowerList(ctx context.Context, fr *models.GetFollowReq) ([]*models.GetFollowRes, error)
	GetFollowingList(ctx context.Context, fr *models.GetFollowReq) ([]*models.GetFollowRes, error)

	LikeAPost(ctx context.Context, userID string, postID string) error
	UnlikeAPost(ctx context.Context, userID string, postID string) error

	WriteComment(ctx context.Context, wc *models.WriteCommentReq) error
	GetComments(ctx context.Context, gc *models.GetCommentsReq) ([]*models.GetCommentsRes, error)
	LikeAComment(ctx context.Context, lc *models.LikeCommentReq) error
}

type Store struct {
	db *db.PrismaClient
}

func NewStore(db *db.PrismaClient) *Store {
	return &Store{db: db}
}
