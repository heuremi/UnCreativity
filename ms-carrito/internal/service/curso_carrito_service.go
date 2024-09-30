package service

import (
	"carrito/internal/model"
	"carrito/internal/repository"
	"carrito/internal/request"
	"carrito/internal/response"
	"errors"

	"github.com/go-playground/validator/v10"
)

type CursoCarritoService interface {
	FindAll() (cursoCarritos []response.CursoCarritoResponse, err error)
	FindByCarrito(carritoId int) (cursos []response.CursoResponse, err error)
	Add(cursoCarrito request.CreateCursoCarritoRequest) error
	DeleteCursoCarrito(cursoCarrito request.DeleteCursoCarritoRequest) error
	DeleteAllCursosByCarritoId(carritoId int) error
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

// Add implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) Add(cursoCarrito request.CreateCursoCarritoRequest) (err error) {
	err = c.Validate.Struct(cursoCarrito)
	if err != nil {
		return err
	}

	modelo := model.CursoCarrito{
		IdCarrito: cursoCarrito.IdCarrito,
		IdCurso:   cursoCarrito.IdCurso,
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
		IdCarrito: cursoCarrito.IdCarrito,
		IdCurso:   cursoCarrito.IdCurso,
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
			IdCarrito: value.IdCarrito,
			IdCurso:   value.IdCurso,
		}
		cursoCarritos = append(cursoCarritos, cursoCarrito)
	}
	return cursoCarritos, nil
}

// FindByCarrito implements CursoCarritoService.
func (c *CursoCarritoServiceImpl) FindByCarrito(carritoId int) (cursos []response.CursoResponse, err error) {
	data, err := c.CursoCarritoRepository.FindByCarrito(carritoId)
	if err != nil {
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
