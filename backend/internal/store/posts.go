package store

import (
	"context"
	"time"
)

type CreateUserPosts struct {
	ID        string    `json:"id"`
	Caption   string    `json:"caption" validate:"required,max=200"`
	Medias    []string  `json:"medias" validate:"required,dive,required,url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (s *Store) CreatePost(ctx context.Context, cp *CreateUserPosts) error {
	queryPosts := `INSERT INTO posts (caption) VALUES ($1) RETURNING id, created_at, updated_at`

	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	err = tx.QueryRow(ctx, queryPosts, cp.Caption).Scan(&cp)
	if err != nil {
		return err
	}

	queryMedia := `INSERT INTO media (p_id, url) VALUES ($1, $2)`

	for _, media := range cp.Medias {
		_, err := tx.Exec(
			ctx,
			queryMedia,
			cp.ID,
			media,
		)
		if err != nil {
			return err
		}
	}

	if err := tx.Commit(ctx); err != nil {
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
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if up.Caption != nil {
		query := `UPDATE posts SET caption = $1, updated_at = NOW() WHERE id = $2 RETURNING created_at, updated_at`
		err := tx.QueryRow(ctx, query, up.Caption, up.ID).Scan(
			&up.CreatedAt,
			&up.Updated_At,
		)
		if err != nil {
			return err
		}
	}

	if len(up.MediaToRemove) > 0 {
		queryDeleteMedia := `DELETE FROM media WHERE p_id = $1 AND url = ANY($2)`
		_, err := tx.Exec(ctx, queryDeleteMedia, up.ID, up.MediaToRemove)
		if err != nil {
			return err
		}
	}

	if len(up.MediaToAdd) > 0 {
		queryInsertMedia := `INSERT INTO media (p_id, url) VALUES ($1, $2)`
		for _, media := range up.MediaToAdd {
			_, err := tx.Exec(ctx, queryInsertMedia, up.ID, media)
			if err != nil {
				return err
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return err
	}

	return nil
}

func (s *Store) DeletePost(ctx context.Context, postID string) error {
	query := `DELETE from posts WHERE id = $1`
	_, err := s.db.Exec(ctx, query, postID)
	if err != nil {
		return err
	}

	return nil
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

func (s *Store) GetPosts(pageSize, pageOffset int64) ([]GetUserPosts, error) {
	return []GetUserPosts{}, nil
}
