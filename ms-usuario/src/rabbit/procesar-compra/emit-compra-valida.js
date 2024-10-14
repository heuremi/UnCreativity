/*
-- Transacción Comienzo.
	1. Emitir compra valida
	2. Buscar Cursos del carrito mediante session_id (rabbitmq)
	3. Agregar cursos a la tabla compras
	4. Avisar que borre el carrito con ese session_id
-- Transacción finalizada. 
*/

import { emitValidarCarrito } from "../validar-carrito/emit-validar-carrito.js"
import { emitCursosPorCarrito } from "../cursos-por-carrito/emit-cursos-por-carrito.js"
import { ServicioCompra } from "../../services/servicio-compra.js"

export async function emitCompraValida(commitResponse)  {

    const servicioCompra = new ServicioCompra()
    const { session_id, transaction_date, buy_order } = commitResponse
    const email = buy_order // TEMP
    console.log("email: ", email)
    const { carrito_id } =  1 //await emitValidarCarrito( {session_id: session_id})
    const cursos = await emitCursosPorCarrito( {carrito_id: 1 })

    let i = 0
    for (let curso in cursos ) {
        servicioCompra.createCompra(i, email, curso, '2024-10-12')
        i += 1
    }
}

