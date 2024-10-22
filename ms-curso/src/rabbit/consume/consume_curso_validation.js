import amqp from 'amqplib'
import { sendCursoValidation } from '../emit/emit_curso_validation.js'
import { ServicioCurso } from '../../services/servicio-curso.js'


export async function consumeCursoValidation() {
    const exchange = 'curso_exist'
    const servicioCurso = new ServicioCurso()
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost:5672/", {
            timeout: 5000
        })
        const channel = await connection.createChannel()
        await channel.assertExchange(
            exchange,
            'direct', 
            {
                durable: false,
        })
        const queue = 'rpc_curso_exist'
        await channel.assertQueue(queue, {exclusive: false})
        await channel.bindQueue(queue, exchange, 'rpc_curso_exist')
        console.log("[Y] Escuchando mensajes en la cola: ", queue)
        channel.consume(queue, async (msg) => {
            if(msg.content) {
                const { correlationId, replyTo } = msg.properties;
                const data = JSON.parse(msg.content)
                if(correlationId && replyTo)
                {
                    const curso = await servicioCurso.findCursoById(data.id_curso)
                    console.log(curso)
                    const reply = {valid : (curso == null ? false : true)}
                    console.log(reply)
                    sendCursoValidation(channel, Buffer.from(JSON.stringify(reply)), correlationId, replyTo)
                }           
            }
            
        }, {
            // opciones
        })

    }catch(error) {
        console.log("Problemas al intentar conectarse con rabbit: ", error.message)
    }
}


    /*
    amqp.connect("amqp://guest:guest@localhost:5672/", (error0, connection) => {
        if(error0) {
            throw error0
        }
        connection.createChannel((error1, channel) => {
            if(error1) {
                throw error1
            }
            const exchange = 'curso_exist'
            channel.assertExchange(exchange, 'direct', {
                durable: false,  
            })

            channel.assertQueue('rpc_curso_exist', {
                exclusive: true 
            }, (error2, q) => {
                if(error2) {
                    throw error2
                }

                console.log("Esperando por mensajes en: %s", q.queue)
                channel.bindQueue(q.queue, exchange, 'rpc_curso_exist')
                channel.consume(q.queue, async (msg) => {
                    if(msg.content) {
                        const { correlationId, replyTo } = msg.properties;
                        const data = JSON.parse(msg.content)
                        if(correlationId && replyTo)
                        {
                            const curso = await servicioCurso.findCursoById(data.id_curso)
                            console.log(curso)
                            const reply = {valid : (curso == null ? false : true)}
                            console.log(reply)
                            sendCursoValidation(channel, Buffer.from(JSON.stringify(reply)), correlationId, replyTo)
                        }           
                    }
                },
                {
                    noAck: true
                })
            })
        })
    })
        */