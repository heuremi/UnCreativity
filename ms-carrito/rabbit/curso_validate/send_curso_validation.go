package validatecurso

import (
	"carrito/internal/env"
	"context"
	"encoding/json"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

func SendCursoValidation(ctx context.Context, CursoId int) (bool, error) {
	conn, err := amqp.Dial(env.GetString("RabbitMQ_URL", "amqp://guest:guest@localhost:5672/"))
	if err != nil {
		return false, err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return false, err
	}
	defer ch.Close()

	err = ch.ExchangeDeclare(
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

	uuid := uuid.New().String()
	validation := &SendValidation{
		CursoId: CursoId,
	}
	data, err := json.Marshal(validation)
	if err != nil {
		return false, err
	}

	err = ch.Publish(
		"curso_exist",
		"rpc_curso_exist",
		false,
		false,
		amqp.Publishing{
			ContentType:   "text/plain",
			Body:          data,
			ReplyTo:       "reply_curso_exist",
			CorrelationId: uuid,
		})

	if err != nil {
		return false, err
	}
	return ConsumeCursoValidation(ch, ctx, uuid)
}

type SendValidation struct {
	CursoId int `json:"curso_id"`
}
