package store

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

type CreateUserPosts struct {
	ID        string    `json:"id"`
	Caption   string    `json:"caption" validate:"required,max=200"`
	Medias    []string  `json:"medias" validate:"required,dive,required,url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (s *Store) CreatePost(ctx context.Context, cp *CreateUserPosts) error {
	cp.ID = uuid.New().String()

	postTxn := s.db.Post.CreateOne(
		db.Post.Caption.Equals(cp.ID),
		db.Post.User.Link(
			db.User.ID.Equals("1"),
		),
	).Tx()

	var transactions []db.PrismaTransaction
	transactions = append(transactions, postTxn)

	for _, media := range cp.Medias {
		txn := s.db.Media.CreateOne(
			db.Media.Media.Set(media),
			db.Media.Post.Link(
				db.Post.ID.Equals(cp.ID),
			),
		).Tx()
		transactions = append(transactions, txn)
	}

	if err := s.db.Prisma.Transaction(transactions...).Exec(ctx); err != nil {
		return err
	}
	return nil
}

type UpdateUserPost struct {
	ID            string    `json:"id"`
	Caption       *string   `json:"caption"`
	MediaToAdd    []string  `json:"media_to_add"`
	MediaToRemove []string  `json:"media_to_remove"`
	CreatedAt     time.Time `json:"created_at"`
	Updated_At    time.Time `json:"updated_at"`
}

func (s *Store) UpdatePost(ctx context.Context, up *UpdateUserPost) error {
	var txns []db.PrismaTransaction
	if up.Caption != nil {
		txn := s.db.Post.FindUnique(
			db.Post.ID.Equals(up.ID),
		).Update(
			db.Post.Caption.Set(*up.Caption),
			db.Post.UpdatedAt.Set(time.Now()),
		).Tx()

		txns = append(txns, txn)
	}

	if len(up.MediaToRemove) > 0 {
		txn := s.db.Media.FindMany(
			db.Media.PID.Equals(up.ID),
		).Delete().Tx()

		txns = append(txns, txn)
	}

	if len(up.MediaToAdd) > 0 {
		for _, media := range up.MediaToAdd {
			txn := s.db.Media.CreateOne(
				db.Media.Media.Set(media),
				db.Media.Post.Link(
					db.Post.ID.Equals(up.ID),
				),
			).Tx()
			txns = append(txns, txn)
		}
	}

	err := s.db.Prisma.Transaction(txns...).Exec(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) DeletePost(ctx context.Context, postID string) error {
	_, err := s.db.Post.FindUnique(
		db.Post.ID.Equals(postID),
	).Update(
		db.Post.Deleted.Set(true),
	).Exec(ctx)
	return err
}

type GetUserPosts struct {
	ID        string    `json:"id"`
	Caption   string    `json:"caption"`
	Medias    []string  `json:"medias"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	IsSaved      bool  `json:"is_saved"`
	LikeCount    int64 `json:"like_count"`
	CommentCount int64 `json:"comment_count"`
	ShareCount   int64 `json:"share_count"`
}

func (s *Store) GetPosts(ctx context.Context, pageSize, pageNo int64, userID string) ([]GetUserPosts, error) {
	posts, err := s.db.Post.FindMany(
		db.Post.UserID.Equals(userID),
	).Skip(
		int(pageSize)*(int(pageNo)-9),
	).Take(
		int(pageSize),
	).With(
		db.Post.Images.Fetch(),
		db.Post.User.Fetch().Select(
			db.User.Username.Field(),
			db.User.Pic.Field(),
		),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	var res []GetUserPosts

	for _, post := range posts {
		var medias []string
		for _, media := range post.Images() {
			medias = append(medias, media.Media)
		}

		uAt, _ := post.UpdatedAt()

		res = append(res, GetUserPosts{
			ID:           post.ID,
			Caption:      post.Caption,
			Medias:       medias,
			CreatedAt:    post.CreatedAt,
			UpdatedAt:    uAt,
			IsSaved:      false,
			LikeCount:    int64(post.Likes),
			CommentCount: int64(post.Comments),
			ShareCount:   int64(post.Shares),
		})
	}

	return res, nil
}

func (s *Store) GetFeed(ctx context.Context, feedReq *models.FeedReq) ([]*models.Post, error) {
	query := `
		SELECT p.*, 
			CASE WHEN l.id IS NOT NULL THEN true ELSE false END AS is_liked
		FROM posts p
		LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = $1
		WHERE p.deleted = false
			AND p.user_id IN (
				SELECT following_id FROM follows WHERE follower_id = $1
			)
			%s
		ORDER BY p.created_at DESC, p.id DESC
		LIMIT $2;
	`

	var pagination string
	args := []interface{}{feedReq.UserID, feedReq.PageSize}
	if feedReq.LastID != "" {
		pagination = "AND p.id < $3"
		args = append(args, feedReq.LastID)
	}
	query = fmt.Sprintf(query, pagination)

	var posts []*models.Post
	err := s.db.Prisma.QueryRaw(query, args...).Exec(ctx, &posts)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch posts: %w", err)
	}

	return posts, nil
}
