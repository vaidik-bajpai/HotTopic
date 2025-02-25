package models

type Paginate struct {
	PageNo   int64 `validate:"gte=1"`
	PageSize int64 `validate:"gte=1"`
}
