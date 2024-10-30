package model

type Carrito struct {
	Id         int `gorm:"type:SERIAL;primaryKey"`
	UsuarioId int `gorm:"type:text;unique;not null"`
}
