package cursoscarrito

import (
	"carrito/internal/env"
	"carrito/internal/response"
	"carrito/internal/service"
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConsumeCursosCarrito(cursoCarritoService service.CursoCarritoService) {

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
		"cursos_carrito",
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
		"rpc_cursos_carrito",
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
		"rpc_cursos_carrito",
		"cursos_carrito",
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
				if err != nil || (body == BodyRequest{}) {
					valid = false
				}

				cursos, err := cursoCarritoService.FindByCarrito(body.CarritoId)
				if err != nil {
					valid = false
				}

				cursosCarrito := &DataCursosCarrito{
					Valid:     valid,
					CarritoId: body.CarritoId,
					CursosId:  cursos,
				}
				log.Print(cursosCarrito)
				data, err := json.Marshal(cursosCarrito)
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
	CarritoId int `json:"carrito_id"`
}

type DataCursosCarrito struct {
	Valid     bool                     `json:"valid"`
	CarritoId int                      `json:"carrito_id"`
	CursosId  []response.CursoResponse `json:"cursos_id"`
}
