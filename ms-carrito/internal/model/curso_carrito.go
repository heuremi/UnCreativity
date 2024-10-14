package model

type CursoCarrito struct {
	IdCarrito int     `gorm:"primaryKey;column:carrito_id"`
	IdCurso   int     `gorm:"primaryKey;column:curso_id"`
	Carrito   Carrito `gorm:"foreignKey:IdCarrito"`
}
