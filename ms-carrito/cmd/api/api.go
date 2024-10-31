package main

import (
	"carrito/internal/controller"

	"github.com/gin-gonic/gin"
)


func CarritoRouter(service *gin.Engine, carritoController *controller.CarritoController, cursoCarritoController *controller.CursoCarritoController) {

	service.GET("/carrito", carritoController.FindAll)
	service.GET("/carrito/:id", carritoController.FindById)
	service.GET("/carrito/curso", cursoCarritoController.FindAll)

	router := service.Group("/cliente/:cliente_id/carrito")

	router.GET("", carritoController.FindByClienteId)
	router.POST("", carritoController.Create)
	router.DELETE("", carritoController.Delete)

	router.GET("/curso/", cursoCarritoController.FindAllByClienteId)
	router.POST("/curso/:curso_id", cursoCarritoController.Create)
	router.DELETE("/curso/:curso_id", cursoCarritoController.DeleteCursoCarrito)
	router.DELETE("/curso/all", cursoCarritoController.DeleteAllCursosByClienteId)

}
