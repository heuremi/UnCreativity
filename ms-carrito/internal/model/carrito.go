package model

type Carrito struct {
	Id           int     `gorm:"type:autoIncrement;primaryKey"`
	EmailCliente string  `gorm:"type:text;unique;not null"`
	PrecioTotal  float64 `gorm:"type:numeric(10,5);not null"`
}
