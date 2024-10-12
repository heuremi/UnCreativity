import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { WebpayPlus } = require('transbank-sdk');

import { asyncHandler } from "../../utils/async-handler.js"

export const create = asyncHandler(async (req, res) => {
    if (req.body?.id_carrito === undefined ) {
        res.status(400).send("carrito_id no encontrado")
        return
    }
    const buyOrder = "O-" + Math.floor(Math.random() * 10000) + 1; // debe ser único
    const sessionId = "S-" + req.body.id_carrito // por ahora el id del carrito
    const amount = 1000
    const returnUrl = "http://localhost:3002/webpay-plus/commit"

    const createResponse = await (new WebpayPlus.Transaction()).create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
    )

    const token = createResponse.token
    const url = createResponse.url

    const paymentUrl = `${url}?token_ws=${token}`
    console.log(paymentUrl)
    res.redirect(paymentUrl);
})


export const commit = asyncHandler(async (req, res) => {
    //Flujos:
  //1. Flujo normal (OK): solo llega token_ws
  //2. Timeout (más de 10 minutos en el formulario de Transbank): llegan TBK_ID_SESION y TBK_ORDEN_COMPRA
  //3. Pago abortado (con botón anular compra en el formulario de Webpay): llegan TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
  //4. Caso atipico: llega todos token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
  console.log("================================================================================");
  console.log(req);
  console.log("================================================================================");
  const params = req.method === 'GET' ? req.query : req.body;

  const token = params.token_ws
  const tbkToken = params.TBK_TOKEN
  const tbkOrdenCompra = params.TBK_ORDER_COMPRA
  const tbkIdSesion = params.TBK_ID_SESION


  console.log(params)
    

  if (token && !tbkToken) { //Flujo 1 (Flujo Normal)
    const commitResponse = await (new WebpayPlus.Transaction()).commit(token)
    if (commitResponse.response_code === 0) { // Logica para avisar que la compra fue efectiva
        res.status(200).json(commitResponse)
        return
    }
  }
  else if (!token && tbkToken) { // Flujo 2
    // Logica para avisar pago anulado por tiempo de espera
  }
  else if (token && tbkToken) { // Flujo 3 
    // Logica para avisar pago anulado por el usuario
  }
  else { // Flujo 4
    // Error inseperado
  }

  res.send("Compra Finalizada")

})

