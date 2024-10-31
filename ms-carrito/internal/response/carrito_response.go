package response

type Response[T any] struct {
	Code   int    `json:"code"`
	Status string `json:"status"`
	Data   T      `json:"data,omitempty"`
}

// Alias

type CarritoFindAllResponse = Response[[]CarritoResponse]
type CarritoFindbyResponse = Response[CarritoResponse]
type CarritoCreateResponse = Response[error]
type CarritoUpdateResponse = Response[error]
type CarritoDeleteResponse = Response[CarritoResponse]

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type CarritoResponse struct {
	Id        int `json:"carrito_id"`
	ClienteId int `json:"cliente_id"`
}
