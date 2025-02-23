package cache

import "github.com/redis/go-redis/v9"

func NewRedisClient(connectionString string) (*redis.Client, error) {
	opt, err := redis.ParseURL(connectionString)
	if err != nil {
		return nil, err
	}

	client := redis.NewClient(opt)
	return client, nil
}
