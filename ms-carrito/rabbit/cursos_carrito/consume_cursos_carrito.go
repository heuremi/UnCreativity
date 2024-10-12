package cursoscarrito

import (
	"carrito/internal/env"
	"encoding/json"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConsumeCursosCarrito() {

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
				log.Printf("Se esta procesando el correlationId: %s", msg.CorrelationId)
				log.Printf("ReplyTo: %s", msg.ReplyTo)
				cursosCarrito := &DataCursosCarrito{
					CarritoId: 1,
					CursosId:  []int{1, 2, 3, 4},
				}
				data, err := json.Marshal(cursosCarrito)
				if err == nil {
					log.Print("se esta enviando??")
					errSend := SendCursosCarrito(msg.CorrelationId, msg.ReplyTo, data)
					if errSend != nil {
						log.Printf("Error: %s", errSend.Error())
					} else {
						log.Print("Es nuilo")
					}
				}
			} else {
				log.Print("no contiene el corrId ni el replyTo")
			}
		}
	}()
	log.Printf("[*] Esperando mensajes.")
	<-forever
}

type DataCursosCarrito struct {
	CarritoId int   `json:"carrito_id"`
	CursosId  []int `json:"cursos_id"`
}
