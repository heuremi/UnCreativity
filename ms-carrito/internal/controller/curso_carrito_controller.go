package controller

import (
	customerrors "carrito/internal/errors"
	"carrito/internal/request"
	"carrito/internal/response"
	"carrito/internal/service"
	"errors"
	"log"
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

// @BasePath /carrito
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

// @BasePath /cliente
// @Summary Devuelve los cursos que tiene un carrito por cliente ID
// @Description Busca cursos por cliente id
// @Tags carritos
// @Param cliente_id path int true "CLIENTE ID"
// @Produce json
// @Success 200 {object} response.CursoCarritoFindbyResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /cliente/{cliente_id}/carrito/curso [get]
func (controller *CursoCarritoController) FindAllByClienteId(ctx *gin.Context) {
	clienteIdString := ctx.Param("cliente_id")
	clienteId, _ := strconv.Atoi(clienteIdString)

	carrito, err := controller.CarritoService.FindByClienteId(clienteId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: "carrito not found",
		})
		return
	}

	data, err := controller.CursoCarritoService.FindByCarrito(carrito.Id)
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
			Message: "Carrito Empty",
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

// @BasePath /cliente
// @Summary Agrega un curso a un carrito
// @Description Agrega un curso a un carrito mediante body
// @Tags carritos
// @Param cliente_id path int true "Cliente ID"
// @Param curso_id path int true "Curso ID"
// @Produce json
// @Success 200 {object} response.CursoCarritoCreateResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 409 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /cliente/{cliente_id}/carrito/curso/{curso_id} [post]
func (controller *CursoCarritoController) Create(ctx *gin.Context) {

	log.Print("Pasa en crear curso carrito")
	clienteIdString := ctx.Param("cliente_id")
	cursoIdString := ctx.Param("curso_id")

	clienteId, err := strconv.Atoi(clienteIdString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	cursoId, err := strconv.Atoi(cursoIdString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	carrito, err := controller.CarritoService.FindByClienteId(clienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	req := request.CreateCursoCarritoRequest{
		CarritoId: carrito.Id,
		CursoId:   cursoId,
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

// @BasePath /cliente
// @Summary Elemina un curso de un carrito
// @Description Para un carrito se eliminar un curso
// @Tags carritos
// @Param cliente_id path int true "Cliente ID"
// @Param curso_id path int true "Curso ID"
// @Accept json
// @Produce json
// @Success 200 {object} response.CursoCarritoDeleteOneResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /cliente/{cliente_id}/carrito/curso/{curso_id} [delete]
func (controller *CursoCarritoController) DeleteCursoCarrito(ctx *gin.Context) {

	clienteIdString := ctx.Param("cliente_id")
	cursoIdString := ctx.Param("curso_id")

	clienteId, err := strconv.Atoi(clienteIdString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	cursoId, err := strconv.Atoi(cursoIdString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: err.Error(),
		})
		return
	}
	carrito, err := controller.CarritoService.FindByClienteId(clienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	req := request.DeleteCursoCarritoRequest{
		CarritoId: carrito.Id,
		CursoId:   cursoId,
	}

	err = controller.CursoCarritoService.DeleteCursoCarrito(req)
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

// @BasePath /cliente
// @Summary Elimina todos los cursos a partir del id cliente
// @Description Elimina todos los cursos de un cliente
// @Tags cliente
// @Param cliente_id path int true "Cliente ID"
// @Produce json
// @Success 200 {object} response.CursoCarritoDeleteAllResponse
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /cliente/{cliente_id}/carrito/curso/all [delete]
func (controller *CursoCarritoController) DeleteAllCursosByClienteId(ctx *gin.Context) {
	clienteIdString := ctx.Param("cliente_id")
	clienteId, err := strconv.Atoi(clienteIdString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	carrito, err := controller.CarritoService.FindByClienteId(clienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}
	_, err = controller.CursoCarritoService.FindByCarrito(carrito.Id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, response.ErrorResponse{
			Code:    404,
			Message: err.Error(),
		})
		return
	}

	err = controller.CursoCarritoService.DeleteAllCursosByCarritoId(carrito.Id)
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

// @BasePath /cliente
// @Summary catnid cursos
// @Description cantidad cursos
// @Tags cliente
// @Param cliente_id path int true "Cliente ID"
// @Produce json
// @Success 200 {object} response.GetCantidadCursos
// @Failure 404 {object} response.ErrorResponse
// @Failure 500 {object} response.ErrorResponse
// @Router /cliente/{cliente_id}/carrito/curso/all [get]
func (controller *CursoCarritoController) GetCantidadCursos(ctx *gin.Context) {

	clienteIdString := ctx.Param("cliente_id")
	clienteId, err := strconv.Atoi(clienteIdString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, response.ErrorResponse{
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	carrito, err := controller.CarritoService.FindByClienteId(clienteId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}

	cantidadCursos, err := controller.CursoCarritoService.GetCantidadCursos(carrito.Id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, response.ErrorResponse{
			Code:    500,
			Message: err.Error(),
		})
		return
	}
	res := response.GetCantidadCursos{
		Code:   200,
		Status: "OK",
		Data:   cantidadCursos,
	}
	ctx.JSON(http.StatusOK, res)
}
