import amqp from 'amqplib/callback_api.js'
import { consumeCursosCarrito } from ('./consume-cursos-por-carrito')
import { v4 } from 'uuid'


export async function emitCursosPorCarrito(data) {
    const replyTo = process.env?.REPLY_TO_CURSOS_CARRITO ?? 'reply_cursos_carrito'
    const correlationId = v4()
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://guest:guest@localhost:5672/', (error0, connection) => {
            if(error0) {
                return reject(error0);
            }
            connection.createChannel( async (error1, channel) => {
                if(error1) {
                    return reject(error1);
                }
                const exchange = 'cursos_carrito'
                channel.assertExchange(exchange, 'direct', {
                    durable: false,
                })
                channel.publish(
                    exchange, "rpc_cursos_carrito",
                    Buffer.from(JSON.stringify(data)), {
                        correlationId: correlationId,
                        replyTo: replyTo,
                        contentType: "text/plain",
                    }
                )
                try {
                    const responseEmit = await consumeCursosCarrito(channel, correlationId, replyTo);
                    resolve(responseEmit); 
                } catch (e) {
                    reject(e); 
                } finally {
                    connection.close();
                }
            })
        })
    })
}
