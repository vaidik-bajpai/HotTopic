package models

type Paginate struct {
	LastID   string `validate:"uuid"`
	PageNo   int64  `validate:"gte=1"`
	PageSize int64  `validate:"gte=1"`
}
