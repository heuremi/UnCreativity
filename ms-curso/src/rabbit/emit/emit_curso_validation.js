export function sendCursoValidation(channel, data, correlationId, replyTo) {
  
  const exchange = 'curso_exist';
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

