package request

type CreateCursoCarritoRequest struct {
	IdCarrito int `json:"id_carrito" validate:"required"`
	IdCurso   int `json:"id_curso" validate:"required"`
}

type DeleteCursoCarritoRequest struct {
	IdCarrito int `json:"id_carrito" validate:"required"`
	IdCurso   int `json:"id_curso" validate:"required"`
}
