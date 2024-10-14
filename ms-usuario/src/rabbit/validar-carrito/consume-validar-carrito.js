

export async function consumeValidarCarrito(channel, correlationId, replyTo) {

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            reject("se demoro mucho")
        }, 1000);

        channel.assertQueue(replyTo, {
            exclusive: false
        })
        const queue = replyTo
        console.log("[Y] Esperando mensajes en: %s", queue)
        channel.bindQueue(queue, "carrito_exist", replyTo)
        console.log("CorrId: ", correlationId)
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
