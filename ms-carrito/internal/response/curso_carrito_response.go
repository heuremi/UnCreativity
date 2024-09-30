package response

type CursoCarritoResponse struct {
	IdCarrito int `json:"id_carrito"`
	IdCurso   int `json:"id_curso"`
}

type CursoResponse struct {
	IdCurso int `json:"id_curso"`
}
