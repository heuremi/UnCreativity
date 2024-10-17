package response

import "carrito/internal/request"

type Response[T any] struct {
	Code   int    `json:"code"`
	Status string `json:"status"`
	Data   T      `json:"data,omitempty"`
}

// Alias

type CarritoFindAllResponse = Response[[]CarritoResponse]
type CarritoFindbyResponse = Response[CarritoResponse]
type CarritoCreateResponse = Response[request.CreateCarritoRequest]
type CarritoUpdateResponse = Response[error]
type CarritoDeleteResponse = Response[CarritoResponse]

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type CarritoResponse struct {
	Id        int    `json:"carrito_id"`
	SessionId string `json:"session_id"`
}
