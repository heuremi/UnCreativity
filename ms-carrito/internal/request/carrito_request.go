package request

type CreateCarritoRequest struct {
	SessionId string `json:"session_id" validate:"required"`
}

type UpdateCarritoRequest struct {
	Id        int    `json:"carrito_id" validate:"required"`
	SessionId string `json:"session_id" validate:"required"`
}
