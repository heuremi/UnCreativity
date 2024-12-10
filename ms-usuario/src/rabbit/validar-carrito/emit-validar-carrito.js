/*
    Valida si el carrito existe en el ms-carrito 
    utilizando session_id 
*/
import amqp from 'amqplib'
import { consumeValidarCarrito } from './consume-validar-carrito.js'
import { v4 } from 'uuid'


export async function emitValidarCarrito(data) {
    console.log("Entra")
    const exchange = 'carrito_exist'
    const replyTo = process.env?.REPLY_TO_CURSOS_CARRITO ?? 'reply_carrito_exist'
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
            exchange, "rpc_carrito_exist",
            Buffer.from(JSON.stringify(data)), {
                correlationId: correlationId,
                replyTo: replyTo,
                contentType: "text/plain",
        })
        console.log("---------")
        const response = await consumeValidarCarrito(channel, correlationId, replyTo)
        await channel.close()
        await connection.close()
        return response

    } catch (error) {
        console.log("Error con la conexion", error)
        return null
    }
}