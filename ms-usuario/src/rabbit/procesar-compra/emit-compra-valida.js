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
import { sendEmail } from "./send-email.js"

export async function emitCompraValida(commitResponse)  {

    try {
        const servicioCompra = new ServicioCompra()
        const { session_id, transaction_date, buy_order } = commitResponse
        const email = "cristian.nettle@alumnos.ucn.cl" //buy_order // TEMP
        const { carrito_id } =  await emitValidarCarrito( {session_id: session_id})
        const cursos = await emitCursosPorCarrito( {carrito_id: carrito_id })
        let i = 0
        for (let curso in cursos.cursos_id ) {
            console.log(cursos.cursos_id[curso])
            await servicioCompra.createCompra(i, email, cursos.cursos_id[curso], '2024-10-12')
            i += 1
        }
        sendEmail(email)
    }catch(err) {
        console.log(err.message)
    }
}

