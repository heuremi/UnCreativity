package response

type Response struct {
	Code   int         `json:"code"`
	Status string      `json:"status"`
	Data   interface{} `json:"data,omitempty"`
}

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type CarritoResponse struct {
	Id        int    `json:"carrito_id"`
	SessionId string `json:"session_id"`
}
