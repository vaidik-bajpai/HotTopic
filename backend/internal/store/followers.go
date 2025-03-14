package store

import (
	"context"
	"errors"
	"log"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

var (
	ErrNotAFollower     = errors.New("not a follower")
	ErrAlreadyAFollower = errors.New("already a follower")
)

func (s *Store) IsFollower(ctx context.Context, followerID string, followingID string) error {
	res, err := s.db.Follow.FindUnique(
		db.Follow.FollowerIDFollowingID(
			db.Follow.FollowerID.Equals(followerID),
			db.Follow.FollowingID.Equals(followingID),
		),
	).Exec(ctx)
	log.Println(res)
	if err != nil {
		if db.IsErrNotFound(err) {
			return ErrNotAFollower
		}
		return err
	}

	return nil
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
		if _, ok := db.IsErrUniqueConstraint(err); ok {
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
	query := s.db.Follow.FindMany(
		db.Follow.FollowingID.Equals(fr.UserID),
		db.Follow.FollowerID.Not(fr.RequesterID),
	).With(
		db.Follow.Follower.Fetch().With(
			db.User.Following.Fetch(db.Follow.FollowerID.Equals(fr.RequesterID)),
		),
	).Take(
		int(fr.PageSize),
	).OrderBy(
		db.Follow.CreatedAt.Order(db.SortOrderDesc),
	)

	if fr.LastID != "" {
		query.Cursor(db.Follow.FollowerID.Cursor(fr.LastID))
	}

	followerRes, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	for _, follower := range followerRes {
		user := follower.Follower()
		if user == nil {
			continue
		}

		isFollowing := len(user.Following()) > 0

		followerList = append(followerList, &models.GetFollowRes{
			UserID:      user.ID,
			Username:    user.Username,
			IsFollowing: isFollowing,
		})
	}

	return followerList, nil
}

func (s *Store) GetFollowingList(ctx context.Context, fr *models.GetFollowReq) ([]*models.GetFollowRes, error) {
	var followingList []*models.GetFollowRes

	query := s.db.Follow.FindMany(
		db.Follow.FollowerID.Equals(fr.UserID),
		db.Follow.FollowingID.Not(fr.RequesterID),
	).With(
		db.Follow.Following.Fetch().With(
			db.User.Following.Fetch(db.Follow.FollowerID.Equals(fr.RequesterID)),
		),
	).Take(
		int(fr.PageSize),
	).OrderBy(
		db.Follow.CreatedAt.Order(db.SortOrderDesc),
	)

	if fr.LastID != "" {
		query.Cursor(db.Follow.FollowingID.Cursor(fr.LastID))
	}

	followingRes, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	for _, follow := range followingRes {
		user := follow.Following()
		if user == nil {
			continue
		}

		pic, ok := user.Pic()
		if !ok {
			pic = ""
		}

		isFollowedByRequester := len(user.Following()) > 0

		followingList = append(followingList, &models.GetFollowRes{
			UserID:      user.ID,
			Username:    user.Username,
			UserPic:     pic,
			IsFollowing: isFollowedByRequester,
		})
	}

	return followingList, nil
}
