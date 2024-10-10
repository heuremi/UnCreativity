package controller

import (
	customerrors "carrito/internal/errors"
	"carrito/internal/request"
	"carrito/internal/response"
	"carrito/internal/service"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CursoCarritoController struct {
	CursoCarritoService service.CursoCarritoService
	CarritoService      service.CarritoService
}

func NewCursoCarritoController(
	serviceCursoCarrito service.CursoCarritoService,
	serviceCarrito service.CarritoService,
) *CursoCarritoController {
	return &CursoCarritoController{
		CursoCarritoService: serviceCursoCarrito,
		CarritoService:      serviceCarrito,
	}
}

func (controller *CursoCarritoController) FindAll(ctx *gin.Context) {
	data, err := controller.CursoCarritoService.FindAll()

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

func (controller *CursoCarritoController) FindByCarrito(ctx *gin.Context) {
	carritoId := ctx.Param("id")
	id, _ := strconv.Atoi(carritoId)

	data, err := controller.CursoCarritoService.FindByCarrito(id)
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

func (controller *CursoCarritoController) Create(ctx *gin.Context) {
	req := request.CreateCursoCarritoRequest{}
	ctx.ShouldBindJSON(&req)

	_, err := controller.CarritoService.FindById(req.IdCarrito)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: err.Error(),
		})
	}

	err = controller.CursoCarritoService.Add(req)
	if err != nil {
		var notFoundCurso *customerrors.CursoNotFoundError
		var conflictCurso *customerrors.CursoConflictError
		switch {
		case errors.As(err, &notFoundCurso):
			ctx.JSON(http.StatusNotFound, response.ErrorResponse{
				Code:    404,
				Message: err.Error(),
			})
		case errors.As(err, &conflictCurso):
			ctx.JSON(http.StatusConflict, response.ErrorResponse{
				Code:    409,
				Message: err.Error(),
			})
		default:
			ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
				Code:    500,
				Message: err.Error(),
			})
		}
		return
	}
	res := response.Response{
		Code:   200,
		Status: "OK",
		Data:   req,
	}
	ctx.JSON(http.StatusOK, res)
}

func (controller *CursoCarritoController) DeleteCursoCarrito(ctx *gin.Context) {
	req := request.DeleteCursoCarritoRequest{}
	ctx.ShouldBindJSON(&req)

	err := controller.CursoCarritoService.DeleteCursoCarrito(req)
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

func (controller *CursoCarritoController) DeleteAllCursosByCarritoId(ctx *gin.Context) {
	carritoId := ctx.Param("carrito_id")
	id, _ := strconv.Atoi(carritoId)

	_, err := controller.CursoCarritoService.FindByCarrito(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: err.Error(),
		})
		return
	}

	err = controller.CursoCarritoService.DeleteAllCursosByCarritoId(id)
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
