package response

import "carrito/internal/request"

type CursoCarritoResponse struct {
	IdCarrito int `json:"id_carrito"`
	IdCurso   int `json:"id_curso"`
}

type CursoCarritoFindAllResponse = Response[[]CursoCarritoResponse]
type CursoCarritoFindbyResponse = Response[[]CursoResponse]
type CursoCarritoCreateResponse = Response[request.CreateCursoCarritoRequest]
type CursoCarritoDeleteOneResponse = Response[request.DeleteCursoCarritoRequest]
type CursoCarritoDeleteAllResponse = Response[error]

type CursoResponse struct {
	IdCurso int `json:"id_curso"`
}
