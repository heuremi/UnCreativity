package main

import (
	"carrito/internal/controller"
	"carrito/internal/db"
	"carrito/internal/repository"
	"carrito/internal/service"
	"carrito/internal/utils"
	"log"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
)

func main() {

	db := db.DatabaseConnection()
	validate := validator.New()

	carritoRepository := repository.NewCarritoRepositoryImpl(db)
	cursoCarritoRepository := repository.NewCursoCarritoImpl(db)

	carritoService, err := service.NewCarritoServiceImpl(carritoRepository, validate)
	if err != nil {
		log.Fatal("error al inicializar el carrito servicio: %v", err)
	}
	cursoCarritoService, err := service.NewCursoCarritoServiceImpl(cursoCarritoRepository, validate)

	carritoController := controller.NewCarritoController(carritoService)
	cursoCarritoController := controller.NewCursoCarritoController(cursoCarritoService)
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
