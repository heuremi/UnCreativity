package main

import (
	"carrito/internal/controller"

	"github.com/gin-gonic/gin"
)

func CarritoRouter(carritoController *controller.CarritoController, cursoCarritoController *controller.CursoCarritoController) *gin.Engine {
	service := gin.Default()

	router := service.Group("/carrito")

	router.GET("", carritoController.FindAll)
	router.GET("/:id", carritoController.FindById)
	router.POST("", carritoController.Create)
	router.PATCH("/:id", carritoController.Update)
	router.DELETE("/:id", carritoController.Delete)
	router.GET("/curso-carrito", cursoCarritoController.FindAll)
	router.GET("/:id/curso", cursoCarritoController.FindByCarrito)
	router.POST("/curso-carrito", cursoCarritoController.Create)
	router.DELETE("/curso-carrito", cursoCarritoController.DeleteCursoCarrito)
	router.DELETE("/:id/curso", cursoCarritoController.DeleteAllCursosByCarritoId)

	return service
}
