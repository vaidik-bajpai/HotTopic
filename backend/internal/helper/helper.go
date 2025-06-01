package helper

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base32"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/vaidik-bajpai/HotTopic/backend/internal/models"
)

func GenerateToken(userID string, ttl time.Duration) (*models.Token, error) {
	token := &models.Token{
		UserID: userID,
		Expiry: time.Now().Add(ttl),
	}

	randomBytes := make([]byte, 16)

	_, err := rand.Read(randomBytes)
	if err != nil {
		return nil, err
	}

	token.Plaintext = base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(randomBytes)
	token.Hash = GenerateHash(token.Plaintext)

	return token, nil
}

func GenerateHash(tokenPlaintext string) []byte {
	hash := sha256.Sum256([]byte(tokenPlaintext))
	tokenHash := hash[:]
	return tokenHash
}

func GetEnvOrPanic(key string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		panic(fmt.Errorf("error environment variable [%s] does not exists", key))
	}
	return value
}

func GetBoolEnvOrPanic(key string) bool {
	value, ok := os.LookupEnv(key)
	if !ok {
		panic(fmt.Errorf("error environment variable [%s] does not exists", key))
	}

	boolValue, err := strconv.ParseBool(value)
	if err != nil {
		panic(fmt.Errorf("invalid boolean value for [%s]: %v", key, err))
	}

	return boolValue
}
