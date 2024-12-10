package carritovalidate

import (
	"carrito/internal/env"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

func SendCursosCarrito(correlationId, replyTo string, data []byte) error {

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
		"carrito_exist",
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
	log.Printf("corrId: %s", correlationId)
	err = ch.Publish(
		"carrito_exist",
		replyTo,
		false,
		false,
		amqp.Publishing{
			ContentType:   "text/plain",
			Body:          data,
			CorrelationId: correlationId,
		})
	if err != nil {
		return err
	}
	return nil
}
