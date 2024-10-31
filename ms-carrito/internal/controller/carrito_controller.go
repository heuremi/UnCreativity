package controller

import (
	"carrito/internal/response"
	"carrito/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CarritoController struct {
	CarritoService service.CarritoService
}

func NewCarritoController(service service.CarritoService) *CarritoController {
	return &CarritoController{CarritoService: service}
}

// @BasePath /carrito
// @Summary Devuelve todos los carritos de la base de datos
// @Description get carritos
// @Tags carritos
// @Accept json
// @Produce json
// @Success 200 {object} response.CarritoFindAllResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito [get]
func (controller *CarritoController) FindAll(ctx *gin.Context) {
	data, err := controller.CarritoService.FindAll()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
	}

	res := response.CarritoFindAllResponse{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}

func (controller *CarritoController) FindByClienteId(ctx *gin.Context) {
	clienteId := ctx.Param("cliente_id")
	id, err := strconv.Atoi(clienteId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: "Bad Request, cliente_id debe ser entero",
		})
		return
	}

	data, err := controller.CarritoService.FindByClienteId(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	res := response.CarritoFindbyResponse{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}

// @BasePath /carrito
// @Summary Devuelve por ID un único carrito
// @Description Busca un carrito por ID
// @Tags carritos
// @Param id path int true "CARRITO ID"
// @Accept json
// @Produce json
// @Success 200 {object} response.CarritoFindbyResponse
// @Failure 400 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/{id} [get]
func (controller *CarritoController) FindById(ctx *gin.Context) {
	carritoId := ctx.Param("id")
	id, err := strconv.Atoi(carritoId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: "Bad Request, id debe ser entero",
		})
		return
	}

	data, err := controller.CarritoService.FindById(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	res := response.CarritoFindbyResponse{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}

// @BasePath /clientes
// @Summary Crea un carrito
// @Description Agrega un carrito a la base de datos
// @Tags carritos
// @Param cliente_id path int true "id cliente"
// @Produce json
// @Success 200 {object} response.CarritoCreateResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /cliente/{cliente_id}/carrito [post]
func (controller *CarritoController) Create(ctx *gin.Context) {
	clienteIdString := ctx.Param("cliente_id")
	clienteId, err := strconv.Atoi(clienteIdString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: "Bad Request, cliente_id debe ser entero",
		})
		return
	}

	err = controller.CarritoService.Create(clienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	res := response.CarritoCreateResponse{
		Code:   200,
		Status: "OK",
		Data:   nil,
	}

	ctx.JSON(http.StatusOK, res)
}

// @BasePath /clientes
// @Summary Elimina un carrito
// @Description Elimina un carrito a partir del ID del cliente
// @Tags carritos
// @Param cliente_id path int true "ID del cliente"
// @Produce json
// @Success 200 {object} response.CarritoUpdateResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /cliente/{cliente_id}/carrito [delete]
func (controller *CarritoController) Delete(ctx *gin.Context) {
	clienteIdString := ctx.Param("cliente_id")
	clienteId, _ := strconv.Atoi(clienteIdString)

	carro, err := controller.CarritoService.FindByClienteId(clienteId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: err.Error(),
		})
		return
	}

	err = controller.CarritoService.Delete(carro.Id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	res := response.CarritoDeleteResponse{
		Code:   200,
		Status: "OK",
		Data:   carro,
	}

	ctx.JSON(http.StatusOK, res)
}
