package store

import (
	"context"
	"errors"
	"log"
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
		log.Printf("[error:%v]\n", err)
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

func (s *Store) GetProfile(ctx context.Context, userID string) (*models.UserProfile, error) {
	up, err := s.db.User.FindUnique(
		db.User.ID.Equals(userID),
	).With(
		db.User.Profile.Fetch(),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	pic, ok := up.Pic()
	if !ok {
		pic = DefaultUserPic
	}

	metadata, ok := up.Profile()
	if !ok {
		return &models.UserProfile{
			UserID:   up.ID,
			Username: up.Username,
			UserPic:  pic,
		}, nil
	}

	bio, ok := metadata.Bio()
	if !ok {
		bio = ""
	}

	return &models.UserProfile{
		UserID:   up.ID,
		Username: up.Username,
		UserPic:  pic,
		Bio:      bio,
	}, nil

}

func (s *Store) ListUsers(ctx context.Context, lu *models.ListUserReq) ([]*models.ListUserRes, error) {
	userList, err := s.db.User.FindMany(
		db.User.ID.Not(lu.UserID),
		db.User.Or(
			db.User.Username.Contains(lu.SearchTerm),
			db.User.Name.Contains(lu.SearchTerm),
			db.User.Profile.Where(
				db.UserProfile.Bio.Contains(lu.SearchTerm),
			),
		),
	).OrderBy(db.User.CreatedAt.Order(db.ASC)).Take(int(lu.PageSize)).Select(
		db.User.ID.Field(),
		db.User.Username.Field(),
		db.User.Name.Field(),
		db.User.Pic.Field(),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	var res []*models.ListUserRes
	for _, user := range userList {
		pic, ok := user.Pic()
		if !ok {
			pic = DefaultUserPic
		}

		name, ok := user.Name()
		if !ok {
			name = ""
		}

		res = append(res, &models.ListUserRes{
			ID:       user.ID,
			Userpic:  pic,
			Username: user.Username,
			Name:     name,
		})
	}

	return res, err
}
