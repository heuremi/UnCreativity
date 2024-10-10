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

func (controller *CarritoController) FindAll(ctx *gin.Context) {
	data, err := controller.CarritoService.FindAll()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
	}

	res := response.Response{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}

func (controller *CarritoController) FindById(ctx *gin.Context) {
	carritoId := ctx.Param("id")
	id, _ := strconv.Atoi(carritoId)

	data, err := controller.CarritoService.FindById(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: err.Error(),
		})
		return
	}

	res := response.Response{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}

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

	res := response.Response{
		Code:   200,
		Status: "OK",
		Data:   req,
	}

	ctx.JSON(http.StatusOK, res)
}

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

	res := response.Response{
		Code:   200,
		Status: "OK",
		Data:   nil,
	}

	ctx.JSON(http.StatusOK, res)
}

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

	res := response.Response{
		Code:   200,
		Status: "OK",
		Data:   carro,
	}

	ctx.JSON(http.StatusOK, res)
}
