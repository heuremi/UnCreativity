import amqp from 'amqplib'


export async function emitDeleteCursosPorCarrito(data) {
    const exchange = 'cursos_carrito'
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
            exchange, "rpc_delete_cursos_carrito",
            Buffer.from(JSON.stringify(data)), {
                contentType: "text/plain",
        })
        await channel.close()
        await connection.close()

    } catch (error) {
        console.log("Error con la conexion", error)
        return null
    }
}
