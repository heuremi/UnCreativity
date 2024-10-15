package rabbit

import (
	"carrito/internal/service"
	carritovalidate "carrito/rabbit/carrito_validate"
	cursocarrito "carrito/rabbit/cursos_carrito"
	"log"
	"time"
)

func InitConsumer(carritoService service.CarritoService, cursoCarritoService service.CursoCarritoService) {

	go func() {
		for {
			err := cursocarrito.ConsumeCursosCarrito(cursoCarritoService)
			if err != nil {
				log.Printf("[x] Error en consumeCursosCarrito: %s", err.Error())
			}
			time.Sleep(5 * time.Second) // esperar hasta volver a intentar
		}
	}()

	go func() {
		for {
			err := carritovalidate.ConsumeCarritoValidate(carritoService, cursoCarritoService)
			if err != nil {
				log.Printf("[Y] Error en Consume Carrito Validate: %s", err.Error())
			}
			time.Sleep(5 * time.Second)
		}
	}()
}
