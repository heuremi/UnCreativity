package main

import (
	"carrito/internal/controller"

	"github.com/gin-gonic/gin"
)

func CarritoRouter(service *gin.Engine, carritoController *controller.CarritoController, cursoCarritoController *controller.CursoCarritoController)  {

	router := service.Group("/carrito")

	router.GET("", carritoController.FindAll)
	router.GET("/:id", carritoController.FindById)
	router.POST("", carritoController.Create)
	router.PATCH("/:id", carritoController.Update)
	router.DELETE("/:id", carritoController.Delete)

	router.GET("/cursos", cursoCarritoController.FindAll)
	router.GET("/:id/cursos", cursoCarritoController.FindByCarrito)
	router.POST("/cursos", cursoCarritoController.Create)
	router.DELETE("/cursos", cursoCarritoController.DeleteCursoCarrito)
	router.DELETE("/:id/curso", cursoCarritoController.DeleteAllCursosByCarritoId)

}
