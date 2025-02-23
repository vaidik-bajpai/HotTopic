package models

import "time"

type Token struct {
	Plaintext string
	Hash      []byte
	UserID    string
	Expiry    time.Time
}
