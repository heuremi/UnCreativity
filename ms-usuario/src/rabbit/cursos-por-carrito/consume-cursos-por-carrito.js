import 'dotenv/config'

export async function consumeCursosCarrito(channel, correlationId, replyTo) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            reject("se demoro mucho")
        }, 10000);

        channel.assertQueue(replyTo, {
            exclusive: false
        })
        const queue = replyTo
        console.log("[Y] Esperando mensajes en: %s", queue)
        channel.bindQueue(queue, "cursos_carrito", replyTo)
 
        channel.consume(queue, (msg) => {
            const sendCorrelationId = msg.properties.correlationId
            if( sendCorrelationId == correlationId) {
                const data = JSON.parse(msg.content)
                channel.ack(msg)
                resolve(data)
            }
        })

    })
}
