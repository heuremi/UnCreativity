package main

import (
	"carrito/docs"
	"carrito/internal/controller"
	"carrito/internal/db"
	"carrito/internal/repository"
	"carrito/internal/service"
	"carrito/internal/utils"
	"carrito/rabbit"

	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	//carritovalidate "carrito/rabbit/carrito_validate"

	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func main() {

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

	routes := gin.Default()
	routes.Use(cors.Default()) // "*"
	docs.SwaggerInfo.BasePath = ""
	routes.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	CarritoRouter(routes, carritoController, cursoCarritoController)

	// CORS da problemas si se hace despues primero definir CORS y luego las rutas
	/*
		routes.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:3000"},
			AllowMethods:     []string{"PUT", "GET", "POST", "DELETE"},
			AllowHeaders:     []string{"Origin"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		}))
	*/

	server := &http.Server{
		Addr:           ":8080",
		Handler:        routes,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	rabbit.InitConsumer(carritoService, cursoCarritoService)
	err = server.ListenAndServe()
	utils.ErrorPanic(err)
}
