package request

type CreateCarritoRequest struct {
	ClienteId int `json:"cliente_id" validate:"required"`
}

type UpdateCarritoRequest struct {
	Id        int `json:"carrito_id" validate:"required"`
	ClienteId int `json:"cliente_id" validate:"required"`
}
