package repository

import (
	"carrito/internal/model"

	"gorm.io/gorm"
)

type CursoCarritoRepository interface {
	FindAll() ([]model.CursoCarrito, error)
	FindByCarrito(carritoId int) ([]int, error)
	Add(cursoCarrito model.CursoCarrito) error
	DeleteCursoCarrito(cursoCarrito model.CursoCarrito) error
	DeleteAllCursosByCarritoId(carritoId int) error
}

type CursoCarritoImpl struct {
	Db *gorm.DB
}

func NewCursoCarritoImpl(Db *gorm.DB) CursoCarritoRepository {
	return &CursoCarritoImpl{Db: Db}
}

// Add implements CursoCarritoRepository.
func (c *CursoCarritoImpl) Add(cursoCarrito model.CursoCarrito) error {
	results := c.Db.Create(&cursoCarrito)
	if results.Error != nil {
		return results.Error
	}
	return nil
}

// DeleteAllCursosByCarritoId implements CursoCarritoRepository.
func (c *CursoCarritoImpl) DeleteAllCursosByCarritoId(carritoId int) error {
	var cursoCarrito model.CursoCarrito

	result := c.Db.Where("carrito_id = ?", carritoId).Delete(&cursoCarrito)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// DeleteCursoCarrito implements CursoCarritoRepository.
func (c *CursoCarritoImpl) DeleteCursoCarrito(cursoCarrito model.CursoCarrito) error {

	result := c.Db.Where("carrito_id = ?", cursoCarrito.CarritoId).Where("curso_id = ?", cursoCarrito.CursoId).Delete(&cursoCarrito)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// FindAll implements CursoCarritoRepository.
func (c *CursoCarritoImpl) FindAll() (cursoCarritos []model.CursoCarrito, err error) {
	results := c.Db.Find(&cursoCarritos)
	if results.Error != nil {
		return nil, results.Error
	}
	return cursoCarritos, nil
}

// FindByCarrito implements CursoCarritoRepository.
func (c *CursoCarritoImpl) FindByCarrito(carritoId int) (cursosIds []int, err error) {
	var cursoCarrito model.CursoCarrito
	results := c.Db.Model(&cursoCarrito).Where("carrito_id = ?", carritoId).Pluck("curso_id", &cursosIds)
	if results.Error != nil {
		return nil, results.Error
	}
	return cursosIds, nil
}
