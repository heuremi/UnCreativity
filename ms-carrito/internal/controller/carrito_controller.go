package controller

import (
	"carrito/internal/request"
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

// @BasePath /carrito
// @Summary Crea un carrito
// @Description Agrega un carrito a la base de datos
// @Tags carritos
// @Param carrito body request.CreateCarritoRequest true "Carrito a crear"
// @Accept json
// @Produce json
// @Success 200 {object} response.CarritoCreateResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito [post]
func (controller *CarritoController) Create(ctx *gin.Context) {
	req := request.CreateCarritoRequest{}
	ctx.ShouldBindJSON(&req)

	err := controller.CarritoService.Create(req)
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
		Data:   req,
	}

	ctx.JSON(http.StatusOK, res)
}

// @BasePath /carrito
// @Summary Actualiza un carrito
// @Description Actualiza un carrito ya existente
// @Tags carritos
// @Param carrito body request.UpdateCarritoRequest true "carrito a modificar"
// @Param id path int true "ID del carrito"
// @Accept json
// @Produce json
// @Success 200 {object} response.CarritoUpdateResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/{id} [patch]
func (controller *CarritoController) Update(ctx *gin.Context) {
	req := request.UpdateCarritoRequest{}
	_ = ctx.ShouldBindJSON(&req)

	carritoId := ctx.Param("id")
	id, _ := strconv.Atoi(carritoId)

	_, err := controller.CarritoService.FindById(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: err.Error(),
		})
		return
	}

	req.Id = id

	err = controller.CarritoService.Update(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	res := response.CarritoUpdateResponse{
		Code:   200,
		Status: "OK",
		Data:   nil,
	}

	ctx.JSON(http.StatusOK, res)
}

// @BasePath /carrito
// @Summary Elimina un carrito
// @Description Elimina un carrito a partir del ID
// @Tags carritos
// @Accept json
// @Param id path int true "ID del carrito"
// @Produce json
// @Success 200 {object} response.CarritoUpdateResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/{id} [delete]
func (controller *CarritoController) Delete(ctx *gin.Context) {
	carritoId := ctx.Param("id")
	id, _ := strconv.Atoi(carritoId)

	carro, err := controller.CarritoService.FindById(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: err.Error(),
		})
		return
	}

	err = controller.CarritoService.Delete(id)
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
