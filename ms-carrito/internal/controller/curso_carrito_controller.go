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

// @BasePath /carrito/cursos
// @Summary Devuelve para todos los carritos, los cursos que contiene
// @Description get cursos para cada carrito
// @Tags carritos
// @Accept json
// @Produce json
// @Success 200 {object} response.CursoCarritoFindAllResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/cursos [get]
func (controller *CursoCarritoController) FindAll(ctx *gin.Context) {
	data, err := controller.CursoCarritoService.FindAll()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
	}
	res := response.CursoCarritoFindAllResponse{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}

// @BasePath /carrito
// @Summary Devuelve los cursos que tiene un carrito por ID
// @Description Busca cursos por id carrito
// @Tags carritos
// @Param id path int true "CARRITO ID"
// @Accept json
// @Produce json
// @Success 200 {object} response.CursoCarritoFindbyResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/{id}/cursos [get]
func (controller *CursoCarritoController) FindByCarrito(ctx *gin.Context) {
	carritoId := ctx.Param("id")
	id, _ := strconv.Atoi(carritoId)

	data, err := controller.CursoCarritoService.FindByCarrito(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}
	if len(data) == 0 {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: "Carrito Empty or Not Found",
		})
		return
	}

	res := response.CursoCarritoFindbyResponse{
		Code:   200,
		Status: "OK",
		Data:   data,
	}
	ctx.JSON(http.StatusOK, res)
}

// @BasePath /carrito
// @Summary Agrega un curso a un carrito
// @Description Agrega un curso a un carrito mediante body
// @Tags carritos
// @Param curso-carrito body request.CreateCursoCarritoRequest true "Curso a agregar a un carrito"
// @Accept json
// @Produce json
// @Success 200 {object} response.CursoCarritoCreateResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 409 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/cursos [post]
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
	res := response.CursoCarritoCreateResponse{
		Code:   200,
		Status: "OK",
		Data:   req,
	}
	ctx.JSON(http.StatusOK, res)
}

// @BasePath /carrito
// @Summary Elemina un curso de un carrito
// @Description Para un carrito se eliminar un curso
// @Tags carritos
// @Param curso-carrito body request.DeleteCursoCarritoRequest true "Curso a eliminar de un carrito"
// @Accept json
// @Produce json
// @Success 200 {object} response.CursoCarritoDeleteOneResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/cursos [delete]
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
	res := response.CursoCarritoDeleteOneResponse{
		Code:   200,
		Status: "OK",
		Data:   req,
	}
	ctx.JSON(http.StatusOK, res)
}

// @BasePath /carrito
// @Summary Agrega un curso a un carrito
// @Description Agrega un curso a un carrito mediante body
// @Tags carritos
// @Param id path int true "CARRITO ID"
// @Accept json
// @Produce json
// @Success 200 {object} response.CursoCarritoDeleteAllResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /carrito/{id}/cursos [delete]
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

	res := response.CursoCarritoDeleteAllResponse{
		Code:   200,
		Status: "OK",
		Data:   nil,
	}

	ctx.JSON(http.StatusOK, res)
}
