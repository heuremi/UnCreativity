package deletecursos

import (
	"carrito/internal/env"
	"carrito/internal/service"
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConsumeDeleteCursos(cursoCarritoService service.CursoCarritoService) error {

	conn, err := amqp.Dial(env.GetString("RabbitMQ_URL", "amqp://guest:guest@localhost:5672/"))
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return err
	}

	err = ch.ExchangeDeclare(
		"cursos_carrito", // Exchange
		"direct",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	q, err := ch.QueueDeclare(
		"rpc_delete_cursos_carrito",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	err = ch.QueueBind(
		q.Name,
		"rpc_delete_cursos_carrito", // key
		"cursos_carrito",            // Exchange
		false,
		nil,
	)
	if err != nil {
		return err
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
		return err
	}

	forever := make(chan struct{})

	go func() {
		for msg := range msgs {
			log.Print("entra a delete cursos")
			var body BodyRequest
			err := json.Unmarshal(msg.Body, &body)
			if err != nil {
				log.Print(err.Error())
			}
			err = cursoCarritoService.DeleteAllCursosByCarritoId(body.CarritoId)
			if err != nil {
				log.Print(err.Error())
			}
		}
	}()
	log.Printf("[*] Esperando mensajes para eliminar cursos en: %s", q.Name)
	<-forever
	return nil
}

type BodyRequest struct {
	CarritoId int `json:"carrito_id"`
}

type DataCarritoValidate struct {
	Valid          bool `json:"valid"`
	CarritoId      int  `json:"carrito_id"`
	CantidadCursos int  `json:"cantidad_cursos"`
}
