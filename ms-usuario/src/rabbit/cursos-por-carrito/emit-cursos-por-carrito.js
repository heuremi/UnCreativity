
import { consumeCursosCarrito } from './consume-cursos-por-carrito.js'
import { v4 } from 'uuid'
import amqp from 'amqplib'


export async function emitCursosPorCarrito(data) {
    const exchange = 'cursos_carrito'
    const replyTo = process.env?.REPLY_TO_CURSOS_CARRITO ?? 'reply_cursos_carrito'
    const correlationId = v4()
    var connection, channel
    try {

        connection = await amqp.connect('amqp://guest:guest@localhost:5672/',
            {timeout : 5000}
        )
        
        channel = await connection.createChannel() 
        
        await channel.assertExchange(exchange, 'direct', {
            durable: false,
        })
        channel.publish(
            exchange, "rpc_cursos_carrito",
            Buffer.from(JSON.stringify(data)), {
                correlationId: correlationId,
                replyTo: replyTo,
                contentType: "text/plain",
        })
        const response = await consumeCursosCarrito(channel, correlationId, replyTo)
        await channel.close()
        await connection.close()
        return response

    } catch (error) {
        console.log("Error con la conexion", error)
        return null
    }
}
