package model

type Carrito struct {
	Id        int `gorm:"type:SERIAL;primaryKey"`
	ClienteId int `gorm:"type:int;unique;not null"`
}
