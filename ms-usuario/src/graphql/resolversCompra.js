import { ServicioCompra } from "../services/servicio-compra.js";

const servicioCompra = new ServicioCompra();

export const resolversCompra = {

    compras: async ({ filtro }) => {
        return servicioCompra.findAllCompras(filtro);
    },

    compra: async ({ id }) => {
        return servicioCompra.findCompraById(id);
    },

    createCompra: async ({ datosCompra }) => {
        return servicioCompra.createCompra(
            datosCompra.id, 
            datosCompra.emailCliente, 
            datosCompra.cursoId, 
            datosCompra.fecha
        );
    },

    updateCompra: async ({ updateCompra }) => {
        return servicioCompra.updateCompra(updateCompra);
    },

    deleteCompra: async ({ id }) => {
        return servicioCompra.deleteCompra(id);
    }
};

