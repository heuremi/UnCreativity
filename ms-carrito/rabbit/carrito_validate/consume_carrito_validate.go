package carritovalidate

import (
	"carrito/internal/env"
	"carrito/internal/response"
	"carrito/internal/service"
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConsumeCarritoValidate(carritoService service.CarritoService, cursoCarritoService service.CursoCarritoService) {

	conn, err := amqp.Dial(env.GetString("RabbitMQ_URL", "amqp://guest:guest@localhost:5672/"))
	if err != nil {
		log.Fatal("fallo al conectarse con rabbit")
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Fallo al conectarse con el canal")
	}

	err = ch.ExchangeDeclare(
		"carrito_exist", // Exchange
		"direct",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Fallo al declarar el exchange")
	}

	q, err := ch.QueueDeclare(
		"rpc_carrito_exist",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Fallo al declarar el queue")
	}

	err = ch.QueueBind(
		q.Name,
		"rpc_carrito_exist", // key
		"carrito_exist",     // Exchange
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Error al bindear el queue")
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal("Fallo al consumir en el canal")
	}

	forever := make(chan struct{})

	go func() {
		for msg := range msgs {
			if msg.CorrelationId != "" && msg.ReplyTo != "" {

				var body BodyRequest
				valid := true
				err := json.Unmarshal(msg.Body, &body)
				if err != nil {
					log.Print(err.Error())
					valid = false
				}
				carrito, err := carritoService.FindBySessionId(body.SessionId)
				if err != nil || (carrito == response.CarritoResponse{}) {
					valid = false
				}
				cursos, err := cursoCarritoService.FindByCarrito(carrito.Id)
				if err != nil {
					log.Print(err.Error())
					valid = false
				}

				dataValidate := &DataCarritoValidate{
					Valid:          valid,
					CarritoId:      carrito.Id,
					CantidadCursos: len(cursos),
				}
				data, err := json.Marshal(dataValidate)
				if err == nil {
					errSend := SendCursosCarrito(msg.CorrelationId, msg.ReplyTo, data)
					if errSend != nil {
						log.Printf("Error: %s", errSend.Error())
					}
				}
			} else {
				log.Print("no contiene el corrId ni el replyTo")
			}
		}
	}()
	log.Printf("[*] Esperando mensajes en: %s", q.Name)
	<-forever
}

type BodyRequest struct {
	SessionId string `json:"session_id"`
}

type DataCarritoValidate struct {
	Valid          bool `json:"valid"`
	CarritoId      int  `json:"carrito_id"`
	CantidadCursos int  `json:"cantidad_cursos"`
}
