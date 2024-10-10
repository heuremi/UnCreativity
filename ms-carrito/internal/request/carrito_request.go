package request

type CreateCarritoRequest struct {
	EmailCliente string  `json:"email_cliente" validate:"required"`
	PrecioTotal  float64 `json:"precio_total" validate:"required"`
}

type UpdateCarritoRequest struct {
	Id           int     `validate:"required"`
	EmailCliente string  `json:"email_cliente" validate:"required"`
	PrecioTotal  float64 `json:"precio_total" validate:"required"`
}
