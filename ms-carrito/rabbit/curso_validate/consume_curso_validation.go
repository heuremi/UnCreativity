package validatecurso

import (
	"carrito/internal/env"
	"context"
	"encoding/json"
	"errors"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConsumeCursoValidation(ch *amqp.Channel, ctx context.Context, correlationId string) (bool, error) {

	err := ch.ExchangeDeclare(
		env.GetString("EXCHANGE_CURSO_EXIST", "curso_exist"),
		"direct",
		false, // durable
		false, // autoDelete
		false, // exlusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return false, err
	}

	q, err := ch.QueueDeclare(
		env.GetString("QUEUE_REPLY_CURSO_EXIST","reply_curso_exist"), // name
		false,               // durable
		false,               // delete when unused
		false,               // exclusive
		false,               // no-wait
		nil,                 // arguments
	)
	if err != nil {
		return false, err
	}

	err = ch.QueueBind(
		q.Name,
		"reply_curso_exist",
		env.GetString("EXCHANGE_CURSO_EXIST","curso_exist"),
		false,
		nil,
	)
	if err != nil {
		return false, err
	}

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		return false, err
	}

	for {
		select {
		case msg, ok := <-msgs:
			if !ok {
				return false, errors.New("cannot connect with channel")
			}
			if msg.CorrelationId == correlationId {
				log.Printf("%v cordd: %s", msg, correlationId)
				var buf Buffer
				var data Body
				json.Unmarshal(msg.Body, &buf)
				json.Unmarshal(buf.Data, &data)
				return data.Valid, nil
			}
			log.Printf("%v cordd: %s", msg, correlationId)

		case <-ctx.Done():
			return false, errors.New("timeout for RPC response, no se pudo validar en ms-curso")
		}
	}
}

type Buffer struct {
	Type string `json:"type"`
	Data []byte `json:"data"`
}

type Body struct {
	Valid bool `json:"valid"`
}
