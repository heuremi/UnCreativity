package main

import (
	"carrito/internal/controller"
	"carrito/internal/db"
	"carrito/internal/repository"
	"carrito/internal/service"
	"carrito/internal/utils"
	cursoscarrito "carrito/rabbit/cursos_carrito"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
)

func main() {

	cursoscarrito.ConsumeCursosCarrito()

	db := db.DatabaseConnection()
	validate := validator.New()

	carritoRepository := repository.NewCarritoRepositoryImpl(db)
	cursoCarritoRepository := repository.NewCursoCarritoImpl(db)

	carritoService, err := service.NewCarritoServiceImpl(carritoRepository, validate)
	utils.ErrorPanic(err)
	cursoCarritoService, err := service.NewCursoCarritoServiceImpl(cursoCarritoRepository, validate)
	utils.ErrorPanic(err)

	carritoController := controller.NewCarritoController(carritoService)
	cursoCarritoController := controller.NewCursoCarritoController(cursoCarritoService, carritoService)
	routes := CarritoRouter(carritoController, cursoCarritoController)

	server := &http.Server{
		Addr:           ":8080",
		Handler:        routes,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	err = server.ListenAndServe()
	utils.ErrorPanic(err)
}
