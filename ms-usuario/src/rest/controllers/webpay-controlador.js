import { createRequire } from 'module';
const require = createRequire(import.meta.url);

var validator = require('validator');
const { WebpayPlus } = require('transbank-sdk');

import { asyncHandler } from "../../utils/async-handler.js"
import { emitValidarCarrito } from '../../rabbit/validar-carrito/emit-validar-carrito.js';
import { emitCompraValida } from '../../rabbit/procesar-compra/emit-compra-valida.js';
import isPositiveInteger from '../../utils/is-integer.js';

export const create = asyncHandler(async (req, res) => {

    const { amount, cliente_id } = req.body
    if (!amount || !cliente_id) {
        res.status(400).json({
          success: false,
          message: `${!amount ? 'amount' : 'cliente_id'} is required`,
        });
        return
    }
    if((typeof(cliente_id) !== 'number') || (typeof(amount) !== 'number')) {
      res.status(400).json({
        success: false,
        message: `${(typeof(cliente_id) !== 'number') ? cliente_id : amount} debe ser de tipo int`,
      });
      return
    }

    if(!isPositiveInteger(amount) || !isPositiveInteger(cliente_id)) {
        res.status(400).json({
          success: false,
          message: `${!isPositiveInteger(amount) ? 'amount' : 'cliente_id'} debe ser un entero positivo`,
        });
        return
    }

    const response = await emitValidarCarrito({ cliente_id }) 
    console.log(response)
    if (response === null) { // No se pudo conectar con ms-carrito
        res.status(500).json({
            success: false,
            message: "Internal error"
        })
        return 
    }
    if ( response.valid == false ) { // Se pudo conectar con ms-carrito, pero sesion_id invalido (no se encontro)
        res.status(404).json({
            success: false,
            message: "cliente_id not found in ms-carrito"
        })
        return 
    }
    if ( response.cantidad_cursos < 1) { // Carrito vacio
        res.status(404).json({
            success: false,
            message: `carrito vacio`
        })
        return
     }

    const buyOrder = response.carrito_id.toString()
    const sessionId = cliente_id.toString()
    const returnUrl = "http://localhost:3002/webpay-plus/commit"

    if (buyOrder.length >= 26) { 
      res.status(500).json({
        success: false,
        message: "INTERNAL ERROR, buy_order excede los 26 caracteres"
      })
      return 
    }
    if (sessionId.length >= 61) {
      res.status(500).json({
        success: false,
        message: "INTERNAL ERROR, sessionId excede los 26 caracteres"
      })
      return 
    }

    const createResponse = await (new WebpayPlus.Transaction()).create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
    )

    const token = createResponse.token
    const url = createResponse.url
    const paymentUrl = `${url}?token_ws=${token}`

    res.status(200).json({
        success: true,
        returnUrl: returnUrl,
        urlWebpay: paymentUrl,
        token: token
    })
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
  const tbkOrdenCompra = params.TBK_ORDEN_COMPRA
  const tbkIdSesion = params.TBK_ID_SESION


  console.log(params)
    

  if (token && !tbkToken) { //Flujo 1 (Flujo Normal)
    const commitResponse = await (new WebpayPlus.Transaction()).commit(token)
    if (commitResponse.response_code === 0) { // Logica para avisar que la compra fue efectiva
        emitCompraValida(commitResponse) 
        res.status(200).json(commitResponse)
    } else { // No acepatada por el banco?
        res.status(402).json({
          message : "cancelado por el banco"
        })
    }
  } 
  else if (!tbkToken && tbkIdSesion && tbkOrdenCompra) { // Flujo 2
    // Logica para avisar pago anulado por tiempo de espera
    res.status(408).json({
      message: 'transaccion anulada por tiempo de espera máximo'
    }) 
  }
  else if (tbkToken && tbkOrdenCompra && tbkIdSesion) { // Flujo 3 
    // Logica para avisar pago anulado por el usuario
    res.status(499).json({
      message: 'transaccion anulada por el usuario'
    })
  }
  else { // Flujo 4 error inesperado
    res.status(500).json({
      message: 'Internal Error'
    })
  }
})

