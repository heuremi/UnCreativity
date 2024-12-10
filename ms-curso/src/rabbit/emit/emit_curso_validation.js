import 'dotenv/config'

export function sendCursoValidation(channel, data, correlationId, replyTo) {
  
  const exchange = process.env?.EXCHANGE_CURSO_VALIDATION || 'curso_exist';
  channel.assertExchange(exchange, 'direct', {
    durable: false
  });
  
  channel.publish(
    exchange, replyTo, 
    Buffer.from(JSON.stringify(data)),
    {
      correlationId: correlationId,
    })
    console.log(" [x] Sent %s", correlationId);
}

