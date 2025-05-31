package database

import "github.com/vaidik-bajpai/HotTopic/backend/internal/db/db"

func NewPrismaClient() (*db.PrismaClient, error) {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return nil, err
	}

	return client, nil
}
