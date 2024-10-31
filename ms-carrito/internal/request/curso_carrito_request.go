package request

type CreateCursoCarritoRequest struct {
	CarritoId int `json:"carrito_id" validate:"required"`
	CursoId   int `json:"curso_id" validate:"required"`
}

type DeleteCursoCarritoRequest struct {
	CarritoId int `json:"carrito_id" validate:"required"`
	CursoId   int `json:"curso_id" validate:"required"`
}
