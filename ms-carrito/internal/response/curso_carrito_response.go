package response

import "carrito/internal/request"

type CursoCarritoResponse struct {
	CarritoId int `json:"carrito_id"`
	CursoId   int `json:"curso_id"`
}

type GetCantidadCursos = Response[int]
type CursoCarritoFindAllResponse = Response[[]CursoCarritoResponse]
type CursoCarritoFindbyResponse = Response[[]CursoResponse]
type CursoCarritoCreateResponse = Response[request.CreateCursoCarritoRequest]
type CursoCarritoDeleteOneResponse = Response[request.DeleteCursoCarritoRequest]
type CursoCarritoDeleteAllResponse = Response[error]

type CursoResponse struct {
	IdCurso int `json:"curso_id"`
}
