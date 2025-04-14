package store

import (
	"context"
	"errors"
	"log"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

var (
	ErrLikeNotProcessed   = errors.New("your like could not be processed")
	ErrUnLikeNotProcessed = errors.New("your unlike could not be processed")
)

func (s *Store) LikeAPost(ctx context.Context, userID string, postID string) error {
	likeModel := s.db.PostLike.CreateOne(
		db.PostLike.User.Link(
			db.User.ID.Equals(userID),
		),
		db.PostLike.Post.Link(
			db.Post.ID.Equals(postID),
		),
	).Tx()

	postModel := s.db.Post.FindUnique(
		db.Post.ID.Equals(postID),
	).Update(
		db.Post.Likes.Increment(1),
	).Tx()

	err := s.db.Prisma.Transaction(likeModel, postModel).Exec(ctx)
	if err != nil {
		log.Println(err)
		return ErrLikeNotProcessed
	}

	return nil
}

func (s *Store) UnlikeAPost(ctx context.Context, userID string, postID string) error {
	likeModel := s.db.PostLike.FindUnique(
		db.PostLike.UserIDPostID(
			db.PostLike.UserID.Equals(userID),
			db.PostLike.PostID.Equals(postID),
		),
	).Delete().Tx()

	postModel := s.db.Post.FindUnique(
		db.Post.ID.Equals(postID),
	).Update(
		db.Post.Likes.Decrement(1),
	).Tx()

	err := s.db.Prisma.Transaction(likeModel, postModel).Exec(ctx)
	if err != nil {
		return ErrUnLikeNotProcessed
	}

	return nil
}

func (s *Store) GetLikedPost(ctx context.Context, gl *models.GetLikedReq) ([]*models.Post, error) {
	query := s.db.PostLike.FindMany(
		db.PostLike.UserID.Equals(gl.UserID),
	).With(
		db.PostLike.Post.Fetch().With(
			db.Post.Like.Fetch(db.PostLike.UserID.Equals(gl.UserID)),
			db.Post.Images.Fetch(),
			db.Post.User.Fetch(),
		),
	).Take(
		int(gl.PageSize),
	).OrderBy(
		db.PostLike.CreatedAt.Order(db.SortOrderDesc),
	)

	if gl.LastID != "" {
		query = query.Cursor(db.PostLike.PostID.Cursor(gl.LastID))
	}

	likedPosts, err := query.Exec(ctx)
	if err != nil {
		return nil, err
	}

	var posts []*models.Post
	for _, post := range likedPosts {
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
