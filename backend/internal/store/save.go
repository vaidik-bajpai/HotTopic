package store

import (
	"context"
	"errors"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

var (
	ErrAlreadySaved  = errors.New("post has already been saved by the user")
	ErrNotASavedPost = errors.New("the post or user does not exists")
)

func (s *Store) SavePost(ctx context.Context, userID string, postID string) error {
	_, err := s.db.Save.CreateOne(
		db.Save.User.Link(
			db.User.ID.Equals(userID),
		),
		db.Save.Post.Link(
			db.Post.ID.Equals(postID),
		),
	).Exec(ctx)
	if err != nil {
		if _, ok := db.IsErrUniqueConstraint(err); ok {
			return ErrAlreadySaved
		}
		return err
	}

	return nil
}

func (s *Store) UnSavePost(ctx context.Context, userID, postID string) error {
	_, err := s.db.Save.FindUnique(
		db.Save.UserIDPostID(
			db.Save.UserID.Equals(userID),
			db.Save.PostID.Equals(postID),
		),
	).Delete().Exec(ctx)
	if err != nil {
		if ok := db.IsErrNotFound(err); ok {
			return ErrNotASavedPost
		}
		return err
	}

	return nil
}

func (s *Store) GetSavedPost(ctx context.Context, gs *models.GetSavedReq) ([]*models.Post, error) {
	query := s.db.Save.FindMany(
		db.Save.UserID.Equals(gs.UserID),
	).With(
		db.Save.Post.Fetch().With(
			db.Post.Like.Fetch(db.PostLike.UserID.Equals(gs.UserID)),
			db.Post.Images.Fetch(),
			db.Post.User.Fetch(),
		),
	).Take(
		int(gs.PageSize),
	).OrderBy(
		db.Save.CreatedAt.Order(db.SortOrderDesc),
	)

	if gs.LastID != "" {
		query = query.Cursor(db.Save.ID.Cursor(gs.LastID))
	}

	savedPost, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	var posts []*models.Post
	for _, post := range savedPost {
		pic, ok := post.Post().User().Pic()
		if !ok {
			pic = DefaultUserPic
		}

		var images []string
		imagesRes := post.Post().Images()
		for _, image := range imagesRes {
			images = append(images, image.Media)
		}

		isLiked := len(post.Post().Like()) > 0

		posts = append(posts, &models.Post{
			ID:           post.PostID,
			UserID:       post.Post().UserID,
			Username:     post.Post().User().Username,
			UserPic:      pic,
			Media:        images,
			Caption:      post.Post().Caption,
			LikeCount:    int64(post.Post().Likes),
			CommentCount: int64(post.Post().Comments),
			IsLiked:      isLiked,
			IsSaved:      true,
		})
	}

	return posts, nil
}
