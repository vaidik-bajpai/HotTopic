package database

import "github.com/vaidik-bajpai/gopher-social/internal/db/db"

func NewPrismaClient(connectionString string) (*db.PrismaClient, error) {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return nil, err
	}

	return client, nil
}
