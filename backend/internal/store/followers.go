package store

import (
	"context"
	"errors"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

var (
	ErrNotAFollower     = errors.New("not a follower")
	ErrAlreadyAFollower = errors.New("already a follower")
)

func (s *Store) IsFollower(ctx context.Context, followerID string, followingID string) (bool, error) {
	_, err := s.db.Follow.FindUnique(
		db.Follow.FollowerIDFollowingID(
			db.Follow.FollowerID.Equals(followerID),
			db.Follow.FollowingID.Equals(followerID),
		),
	).Exec(ctx)
	if err != nil {
		if db.IsErrNotFound(err) {
			return false, ErrNotAFollower
		}
		return false, err
	}

	return true, nil
}

func (s *Store) FollowUser(ctx context.Context, followerID string, followingID string) error {
	_, err := s.db.Follow.CreateOne(
		db.Follow.Follower.Link(
			db.User.ID.Equals(followerID),
		),
		db.Follow.Following.Link(
			db.User.ID.Equals(followingID),
		),
	).Exec(ctx)
	if err != nil {
		if _, ok := db.IsErrUniqueConstraint(err); !ok {
			return ErrAlreadyAFollower
		}
		return err
	}

	return nil
}

func (s *Store) UnFollowUser(ctx context.Context, followerID, unFollowedID string) error {
	_, err := s.db.Follow.FindUnique(
		db.Follow.FollowerIDFollowingID(
			db.Follow.FollowerID.Equals(followerID),
			db.Follow.FollowingID.Equals(unFollowedID),
		),
	).Delete().Exec(ctx)
	if err != nil {
		if errors.Is(err, db.ErrNotFound) {
			return ErrNotAFollower
		}
		return err
	}
	return nil
}

func (s *Store) GetFollowerList(ctx context.Context, fr *models.GetFollowReq) ([]*models.GetFollowRes, error) {
	var followerList []*models.GetFollowRes
	err := s.db.Prisma.Raw.QueryRaw(`
		SELECT 
			u.id AS user_id, 
			u.username, 
			CASE WHEN f2.follower_id IS NOT NULL THEN 'true' ELSE 'false' END AS is_following
		FROM "Follow" f1
		JOIN "User" u ON u.id = f1.follower_id
		LEFT JOIN "Follow" f2 
			ON f2.follower_id = u.id 
			AND f2.following_id = ? 
		WHERE f1.following_id = ? 
		ORDER BY 
			CASE WHEN f2.follower_id IS NOT NULL THEN 0 ELSE 1 END,  
			u.username ASC  
		LIMIT ? OFFSET ?`,
		fr.RequesterID,
		fr.UserID,
		fr.PageSize,
	).Exec(ctx, followerList)
	if err != nil {
		return nil, err
	}

	return followerList, nil
}

func (s *Store) GetFollowingList(ctx context.Context, fr *models.GetFollowReq) ([]*models.GetFollowRes, error) {
	var followingList []*models.GetFollowRes
	err := s.db.Prisma.Raw.QueryRaw(`
		SELECT 
			u.id AS user_id, 
			u.username, 
			CASE WHEN f2.follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following
		FROM "Follow" f1
		JOIN "User" u ON u.id = f1.following_id
		LEFT JOIN "Follow" f2 
			ON f2.follower_id = ?  
			AND f2.following_id = u.id  
		WHERE f1.follower_id = ?  
		ORDER BY 
			CASE WHEN f2.follower_id IS NOT NULL THEN 0 ELSE 1 END,  
			u.username ASC  
		LIMIT ? OFFSET ?`,
		fr.RequesterID,
		fr.UserID,
		fr.PageSize,
	).Exec(ctx, followingList)
	if err != nil {
		return nil, err
	}

	return followingList, nil
}
