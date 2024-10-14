package model

type Carrito struct {
	Id        int    `gorm:"type:SERIAL;primaryKey"`
	SessionId string `gorm:"type:text;unique;not null"`
}
