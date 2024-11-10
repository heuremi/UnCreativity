package model

type CursoCarrito struct {
	CarritoId int     `gorm:"primaryKey;column:carrito_id"`
	CursoId   int     `gorm:"primaryKey;column:curso_id"`
	Carrito   Carrito `gorm:"foreignKey:CarritoId"`
}
