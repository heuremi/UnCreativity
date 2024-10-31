/*
-- Transacción Comienzo.
	1. Emitir compra valida
	2. Buscar Cursos del carrito mediante session_id (rabbitmq)
	3. Agregar cursos a la tabla compras
	4. Avisar que borre el carrito con ese session_id
-- Transacción finalizada. 
*/


import { emitDeleteCursosPorCarrito } from "../delete-cursos-por-carrito/emit-delete-cursos-por-carrito.js"
import { emitCursosPorCarrito } from "../cursos-por-carrito/emit-cursos-por-carrito.js"
import { ServicioCompra } from "../../services/servicio-compra.js"
import { ServicioCliente } from "../../services/servicio-cliente.js"
import { sendEmail } from "./send-email.js"
import { format } from 'date-fns';

export async function emitCompraValida(commitResponse)  {

    try {
        const servicioCompra = new ServicioCompra()
        const servicioCliente = new ServicioCliente()
        const { session_id, transaction_date, buy_order} = commitResponse
        const cliente_id = parseInt(session_id)
        const carrito_id = parseInt(buy_order)
        const { email } = await servicioCliente.findClienteById(cliente_id)
        const cursos = await emitCursosPorCarrito( {carrito_id: carrito_id })
        const fecha = format(new Date(transaction_date), 'yyyy-MM-dd')
        console.log(cursos)
        for (let curso in cursos.cursos_id ) {
            console.log(cursos.cursos_id[curso])
            await servicioCompra.createCompra(
            {
                clienteId: cliente_id,
                cursoId: cursos.cursos_id[curso],
                fecha: fecha
            })
        }
        emitDeleteCursosPorCarrito( {carrito_id: carrito_id} )
        sendEmail(email)
    }catch(err) {
        console.log(err.message)
    }
}

