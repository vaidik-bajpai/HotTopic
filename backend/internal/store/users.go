package store

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/vaidik-bajpai/gopher-social/internal/db/db"
	"github.com/vaidik-bajpai/gopher-social/internal/helper"
	"github.com/vaidik-bajpai/gopher-social/internal/models"
	"golang.org/x/crypto/bcrypt"
)

const (
	ScopeActivation     = "scope:activation"
	ScopeForgotPassword = "scope:forgot-password"
)

type Password struct {
	rawPassword string
	Hash        []byte
}

func NewPassword(raw string) *Password {
	return &Password{
		rawPassword: raw,
	}
}

func (p *Password) MakeHash() error {
	var err error
	p.Hash, err = bcrypt.GenerateFromPassword([]byte(p.rawPassword), 12)
	if err != nil {
		return err
	}
	return err
}

func (p *Password) MatchHash(rawPassword string) (bool, error) {

	err := bcrypt.CompareHashAndPassword(p.Hash, []byte(rawPassword))
	if err != nil {
		return false, err
	}
	return true, nil
}

type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name" validate:"required,min=6,max=30"`
	Username  string    `json:"username" validate:"required.min=6,max=30"`
	Password  *Password `json:"-"`
	Email     string    `json:"email" validate:"required,email,checkEmail"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (s *Store) UserRegistration(ctx context.Context, cu *User) (*models.Token, error) {
	err := cu.Password.MakeHash()
	if err != nil {
		return nil, err
	}

	userID := uuid.New().String()

	token, err := helper.GenerateToken(userID, 3*24*time.Hour)
	if err != nil {
		return nil, errors.New("could not generate the activation token")
	}

	userTxn := s.db.User.CreateOne(
		db.User.ID.Set(userID),
		db.User.Username.Set(cu.Username),
		db.User.Email.Set(cu.Email),
		db.User.Password.Set(string(cu.Password.Hash)),
	).Tx()

	tokenTxn := s.db.Token.CreateOne(
		db.Token.Token.Set(string(token.Hash)),
		db.Token.TTL.Set(token.Expiry),
		db.Token.Scope.Set(ScopeActivation),
		db.Token.User.Link(
			db.User.ID.Equals(userID),
		),
	).Tx()

	if err := s.db.Prisma.Transaction(userTxn, tokenTxn).Exec(ctx); err != nil {
		return nil, err
	}

	return token, nil
}

func (s *Store) UserViaEmail(ctx context.Context, email string) (*User, error) {
	user, err := s.db.User.FindUnique(
		db.User.Email.Equals(email),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	password := &Password{
		Hash: []byte(user.Password),
	}

	name, _ := user.Name()

	return &User{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		Name:      name,
		Password:  password,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}, nil
}

func (s *Store) ResetPassword(ctx context.Context, rp *models.ResetPassword) error {
	_, err := s.db.User.FindUnique(
		db.User.ID.Equals(rp.UserID),
	).Update(
		db.User.Password.Set(string(rp.NewPasswordHash)),
	).Exec(ctx)
	if err != nil {
		return nil
	}

	return nil
}

func (s *Store) ActivateUser(ctx context.Context, userID string) error {
	_, err := s.db.User.FindUnique(
		db.User.ID.Equals(userID),
	).Update(
		db.User.Activated.Set(true),
	).Exec(ctx)
	if err != nil {
		return err
	}

	return nil
}
