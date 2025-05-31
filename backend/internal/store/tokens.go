package store

import (
	"context"
	"errors"
	"time"

	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
)

var (
	ErrTokenNotFound = errors.New("token not found")
	ErrTokenExpired  = errors.New("token expired")
)

func (s *Store) CreateForgotPasswordToken(ctx context.Context, token *models.Token) error {
	_, err := s.db.Token.CreateOne(
		db.Token.Token.Set(string(token.Hash)),
		db.Token.TTL.Set(token.Expiry),
		db.Token.Scope.Set(ScopeForgotPassword),
		db.Token.User.Link(
			db.User.ID.Equals(token.UserID),
		),
	).Exec(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) GetUserFromToken(ctx context.Context, token *models.Token) error {
	t, err := s.db.Token.FindUnique(
		db.Token.Token.Equals(string(token.Hash)),
	).Exec(ctx)
	if err != nil {
		return err
	}

	token.UserID = t.UID
	token.Hash = []byte(t.Token)
	token.Expiry = time.Time(t.TTL)
	return nil
}

func (s *Store) GetTokenModel(ctx context.Context, tokenHash []byte) (*models.Token, error) {
	tModel, err := s.db.Token.FindUnique(
		db.Token.Token.Equals(string(tokenHash)),
	).Exec(ctx)
	if err != nil {
		if db.IsErrNotFound(err) {
			return nil, ErrTokenNotFound
		}
		return nil, err
	}

	expiry := time.Time(tModel.TTL)
	if time.Now().After(expiry) {
		return nil, ErrTokenExpired
	}

	return &models.Token{
		UserID: tModel.UID,
		Expiry: expiry,
	}, nil
}

func (s *Store) CreateToken(ctx context.Context, token *models.Token, scope string) error {
	deleteTx := s.db.Token.FindMany(
		db.Token.UID.Equals(token.UserID),
		db.Token.Scope.Equals(scope),
	).Update(
		db.Token.TTL.Set(time.Now()),
	).Tx()

	createTx := s.db.Token.CreateOne(
		db.Token.Token.Set(string(token.Hash)),
		db.Token.TTL.Set(token.Expiry),
		db.Token.Scope.Set(scope),
		db.Token.User.Link(
			db.User.ID.Equals(token.UserID),
		),
	).Tx()

	err := s.db.Prisma.Transaction(deleteTx, createTx).Exec(ctx)
	return err
}
