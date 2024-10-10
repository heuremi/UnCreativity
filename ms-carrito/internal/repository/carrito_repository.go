package repository

import (
	"carrito/internal/model"
	"carrito/internal/request"
	"errors"

	"gorm.io/gorm"
)

type CarritoRepository interface {
	FindAll() ([]model.Carrito, error)
	FindById(carritoId int) (carrito model.Carrito, err error)
	Save(carrito model.Carrito) error
	Update(carrito model.Carrito) error
	Delete(carritoId int) error
}

type CarritoRepositoryImpl struct {
	Db *gorm.DB
}

func NewCarritoRepositoryImpl(Db *gorm.DB) CarritoRepository {
	return &CarritoRepositoryImpl{Db: Db}
}

func (c CarritoRepositoryImpl) FindAll() (carritos []model.Carrito, err error) {
	results := c.Db.Find(&carritos)
	if results.Error != nil {
		return nil, results.Error
	}
	return carritos, nil
}

func (c CarritoRepositoryImpl) FindById(carritoId int) (carrito model.Carrito, err error) {
	results := c.Db.Find(&carrito, carritoId)
	if results.Error != nil {
		return model.Carrito{}, results.Error
	}

	if results.RowsAffected == 0 {
		return model.Carrito{}, errors.New("carrito not found")
	}
	return carrito, nil
}

func (c *CarritoRepositoryImpl) Save(carrito model.Carrito) error {
	result := c.Db.Create(&carrito)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (c *CarritoRepositoryImpl) Update(carrito model.Carrito) error {
	var data = request.UpdateCarritoRequest{
		Id:           carrito.Id,
		EmailCliente: carrito.EmailCliente,
		PrecioTotal:  carrito.PrecioTotal,
	}

	result := c.Db.Model(&carrito).Updates(data)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (c *CarritoRepositoryImpl) Delete(carritoId int) error {
	var carrito model.Carrito

	result := c.Db.Where("id = ?", carritoId).Delete(&carrito)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
