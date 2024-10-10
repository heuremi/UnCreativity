package consume

import (
	"context"
	"encoding/json"
	"errors"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConsumeCursoValidation(ch *amqp.Channel, ctx context.Context, correlationId string) (bool, error) {

	err := ch.ExchangeDeclare(
		"curso_exist",
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
		"reply_curso_exist", // name
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
		"curso_exist",
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
				var buf Buffer
				var data Body
				json.Unmarshal(msg.Body, &buf)
				json.Unmarshal(buf.Data, &data)
				return data.Valid, nil
			}
		case <-ctx.Done():
			return false, errors.New("timeout for RPC response")
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
