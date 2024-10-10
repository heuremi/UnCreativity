package service

import (
	"carrito/internal/model"
	"carrito/internal/repository"
	"carrito/internal/request"
	"carrito/internal/response"
	"errors"

	"github.com/go-playground/validator/v10"
)

// Interfaz
type CarritoService interface {
	Create(carrito request.CreateCarritoRequest) error
	Update(carrito request.UpdateCarritoRequest) error
	Delete(carritoId int) error
	FindById(carritoId int) (carrito response.CarritoResponse, err error)
	FindAll() (carritos []response.CarritoResponse, err error)
}

// Impl
type CarritoServiceImpl struct {
	CarritoRepository repository.CarritoRepository
	Validate          *validator.Validate
}

func NewCarritoServiceImpl(carritoRepository repository.CarritoRepository, validate *validator.Validate) (service CarritoService, err error) {
	if validate == nil {
		return nil, errors.New("validator instance cannot be nil")
	}
	return &CarritoServiceImpl{
		CarritoRepository: carritoRepository,
		Validate:          validate,
	}, err
}

// Create implements CarritoService.
func (c *CarritoServiceImpl) Create(carrito request.CreateCarritoRequest) (err error) {
	err = c.Validate.Struct(carrito)

	if err != nil {
		return err
	}

	modelo := model.Carrito{
		EmailCliente: carrito.EmailCliente,
		PrecioTotal:  carrito.PrecioTotal,
	}
	c.CarritoRepository.Save(modelo)
	return nil
}

// Delete implements CarritoService.
func (c *CarritoServiceImpl) Delete(carritoId int) (err error) {
	err = c.CarritoRepository.Delete(carritoId)

	if err != nil {
		return err
	}
	return nil
}

// FindAll implements CarritoService.
func (c *CarritoServiceImpl) FindAll() (carritos []response.CarritoResponse, err error) {
	result, err := c.CarritoRepository.FindAll()

	if err != nil {
		return nil, err
	}

	for _, value := range result {
		carrito := response.CarritoResponse{
			Id:           value.Id,
			EmailCliente: value.EmailCliente,
			PrecioTotal:  value.PrecioTotal,
		}
		carritos = append(carritos, carrito)
	}
	return carritos, nil
}

// FindById implements CarritoService.
func (c *CarritoServiceImpl) FindById(carritoId int) (carrito response.CarritoResponse, err error) {
	data, err := c.CarritoRepository.FindById(carritoId)
	if err != nil {
		return response.CarritoResponse{}, err
	}

	res := response.CarritoResponse{
		Id:           data.Id,
		EmailCliente: data.EmailCliente,
		PrecioTotal:  data.PrecioTotal,
	}
	return res, nil
}

// Update implements CarritoService.
func (c *CarritoServiceImpl) Update(carrito request.UpdateCarritoRequest) error {
	data, err := c.CarritoRepository.FindById(carrito.Id)

	if err != nil {
		return err
	}

	data.EmailCliente = carrito.EmailCliente
	data.PrecioTotal = carrito.PrecioTotal
	c.CarritoRepository.Update(data)
	return nil
}
