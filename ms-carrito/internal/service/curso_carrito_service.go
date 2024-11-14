package service

import (
	customerrors "carrito/internal/errors"
	"carrito/internal/model"
	"carrito/internal/repository"
	"carrito/internal/request"
	"carrito/internal/response"
	validatecurso "carrito/rabbit/curso_validate"
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/go-playground/validator/v10"
)

type CursoCarritoService interface {
	FindAll() (cursoCarritos []response.CursoCarritoResponse, err error)
	FindByCarrito(carritoId int) (cursos []response.CursoResponse, err error)
	Add(cursoCarrito request.CreateCursoCarritoRequest) error
	DeleteCursoCarrito(cursoCarrito request.DeleteCursoCarritoRequest) error
	DeleteAllCursosByCarritoId(carritoId int) error
	GetCantidadCursos(carritoId int) (int, error)
}

type CursoCarritoServiceImpl struct {
	CursoCarritoRepository repository.CursoCarritoRepository
	Validate               *validator.Validate
}

func NewCursoCarritoServiceImpl(cursoCarritoRepository repository.CursoCarritoRepository, validate *validator.Validate) (service CursoCarritoService, err error) {
	if validate == nil {
		return nil, errors.New("validator instance cannot be nil")
	}
	return &CursoCarritoServiceImpl{
		CursoCarritoRepository: cursoCarritoRepository,
		Validate:               validate,
	}, err
}

// GetCantidadCursos implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) GetCantidadCursos(carritoId int) (int, error) {
	data, err := c.FindByCarrito(carritoId)
	if err != nil {
		return 0, err
	}
	return len(data), nil
}

// Add implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) Add(cursoCarrito request.CreateCursoCarritoRequest) (err error) {
	err = c.Validate.Struct(cursoCarrito)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
	defer cancel()
	valido, err := validatecurso.SendCursoValidation(ctx, cursoCarrito.CursoId)
	log.Printf("error aca en cursos : %v", err)
	if err != nil {
		return err
	}
	if !valido {
		return &customerrors.CursoNotFoundError{
			Msg: fmt.Sprintf("No se pudo encontrar el curso con id: %d", cursoCarrito.CursoId),
		}
	}

	cursos, _ := c.FindByCarrito(cursoCarrito.CarritoId)
	for _, cursoResponse := range cursos {
		if cursoResponse.IdCurso == cursoCarrito.CursoId {
			return &customerrors.CursoConflictError{
				Msg: fmt.Sprintf("Conflicto con el curso con id: %d , Ya existe en el carrito", cursoCarrito.CursoId),
			}
		}
	}

	modelo := model.CursoCarrito{
		CarritoId: cursoCarrito.CarritoId,
		CursoId:   cursoCarrito.CursoId,
	}
	c.CursoCarritoRepository.Add(modelo)
	return nil
}

// DeleteAllCursosByCarritoId implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) DeleteAllCursosByCarritoId(carritoId int) (err error) {
	err = c.CursoCarritoRepository.DeleteAllCursosByCarritoId(carritoId)

	if err != nil {
		return err
	}
	return nil
}

// DeleteCursoCarrito implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) DeleteCursoCarrito(cursoCarrito request.DeleteCursoCarritoRequest) (err error) {
	err = c.Validate.Struct(cursoCarrito)
	if err != nil {
		return err
	}

	modelo := model.CursoCarrito{
		CarritoId: cursoCarrito.CarritoId,
		CursoId:   cursoCarrito.CursoId,
	}
	err = c.CursoCarritoRepository.DeleteCursoCarrito(modelo)

	if err != nil {
		return err
	}
	return nil
}

// FindAll implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) FindAll() (cursoCarritos []response.CursoCarritoResponse, err error) {
	result, err := c.CursoCarritoRepository.FindAll()
	if err != nil {
		return nil, err
	}

	for _, value := range result {
		cursoCarrito := response.CursoCarritoResponse{
			CarritoId: value.CarritoId,
			CursoId:   value.CursoId,
		}
		cursoCarritos = append(cursoCarritos, cursoCarrito)
	}
	return cursoCarritos, nil
}

// FindByCarrito implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) FindByCarrito(carritoId int) (cursos []response.CursoResponse, err error) {
	data, err := c.CursoCarritoRepository.FindByCarrito(carritoId)
	if err != nil {
		log.Printf("%s", err.Error())
		return []response.CursoResponse{}, err
	}

	for _, value := range data {
		curso := response.CursoResponse{
			IdCurso: value,
		}
		cursos = append(cursos, curso)
	}
	return cursos, nil
}
