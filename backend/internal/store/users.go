package store

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/db/db"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/helper"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserNotFound = errors.New("user not found")
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
	Name      string    `json:"name" validate:"required,min=3,max=30"`
	Username  string    `json:"username" validate:"required.min=6,max=30"`
	Password  *Password `json:"-"`
	Email     string    `json:"email" validate:"required,email,checkEmail"`
	Activated bool      `json:"activated"`
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

	userProfileTxn := s.db.UserProfile.CreateOne(
		db.UserProfile.User.Link(
			db.User.ID.Equals(userID),
		),
		db.UserProfile.Bio.Set(""),
	).Tx()

	if err := s.db.Prisma.Transaction(userTxn, tokenTxn, userProfileTxn).Exec(ctx); err != nil {
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
		if ok := db.IsErrNotFound(err); ok {
			return nil, ErrUserNotFound
		}
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
		Activated: user.Activated,
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

func (s *Store) GetProfile(ctx context.Context, gp *models.GetProfileReq) (*models.UserProfile, error) {
	up, err := s.db.User.FindUnique(
		db.User.ID.Equals(gp.UserID),
	).With(
		db.User.Profile.Fetch(),
		db.User.Following.Fetch(
			db.Follow.FollowerID.Equals(gp.RequesterID),
		),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	pic, ok := up.Pic()
	if !ok {
		pic = DefaultUserPic
	}

	isFollowing := len(up.Following()) > 0

	metadata, ok := up.Profile()
	if !ok {
		return &models.UserProfile{
			UserID:      up.ID,
			Username:    up.Username,
			UserPic:     pic,
			IsFollowing: isFollowing,
		}, nil
	}

	bio, ok := metadata.Bio()
	if !ok {
		bio = ""
	}

	return &models.UserProfile{
		UserID:         up.ID,
		Username:       up.Username,
		UserPic:        pic,
		Bio:            bio,
		IsFollowing:    isFollowing,
		Pronouns:       metadata.Pronouns,
		TotalPosts:     int64(metadata.PostNumber),
		TotalFollowers: int64(metadata.Followers),
		TotalFollowing: int64(metadata.Following),
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
	).With(
		db.User.Followers.Fetch(
			db.Follow.FollowerID.Equals(lu.UserID),
		),
	).OrderBy(
		db.User.CreatedAt.Order(db.ASC),
	).Take(int(lu.PageSize)).
		Exec(ctx)
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

		isFollowing := len(user.Followers()) > 0

		res = append(res, &models.ListUserRes{
			ID:          user.ID,
			Userpic:     pic,
			Username:    user.Username,
			Name:        name,
			IsFollowing: isFollowing,
		})
	}

	return res, err
}

func (s *Store) UpdateProfile(ctx context.Context, up *models.UpdateProfile) error {
	query := s.db.User.FindUnique(
		db.User.ID.Equals(up.UserID),
	)

	var profileParam []db.UserSetParam

	if up.Userpic != "" {
		profileParam = append(profileParam, db.User.Pic.Set(up.Userpic))
	}

	if up.Username != "" {
		profileParam = append(profileParam, db.User.Username.Set(up.Username))
	}

	query2 := s.db.UserProfile.FindUnique(
		db.UserProfile.UID.Equals(up.UserID),
	)

	var userProfileParam []db.UserProfileSetParam

	if up.Bio != "" {
		userProfileParam = append(userProfileParam, db.UserProfile.Bio.Set(up.Bio))
	}

	if len(up.Pronouns) != 0 {
		userProfileParam = append(userProfileParam, db.UserProfile.Pronouns.Set(up.Pronouns))
	}

	var txns []db.PrismaTransaction

	if len(profileParam) != 0 {
		txns = append(txns, query.Update(profileParam...).Tx())
	}

	if len(userProfileParam) != 0 {
		txns = append(txns, query2.Update(userProfileParam...).Tx())
	}

	if err := s.db.Prisma.Transaction(txns...).Exec(ctx); err != nil {
		return err
	}

	return nil
}
