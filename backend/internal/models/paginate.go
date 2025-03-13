package models

type Paginate struct {
	LastID   string `validate:"omitempty,uuid"`
	PageSize int64  `validate:"gte=1"`
}
