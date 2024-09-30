package model

type CursoCarrito struct {
	IdCarrito int     `gorm:"primaryKey;autoIncrement:false;column:carrito_id"`
	IdCurso   int     `gorm:"primaryKey;autoIncrement:false;column:curso_id"`
	Carrito   Carrito `gorm:"foreignKey:IdCarrito"`
}
