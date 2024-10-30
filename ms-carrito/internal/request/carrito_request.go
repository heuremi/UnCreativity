package request

type CreateCarritoRequest struct {
	UsuarioId int `json:"usuario_id" validate:"required"`
}

type UpdateCarritoRequest struct {
	Id        int `json:"carrito_id" validate:"required"`
	UsuarioId int `json:"usuario_id" validate:"required"`
}
