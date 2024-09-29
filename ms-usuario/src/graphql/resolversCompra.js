import { ServicioCompra } from "../services/servicio-compra.js";

const servicioCompra = new ServicioCompra();

export const resolversCompra = {

    compras: async ({ filtro }) => {
        return servicioCompra.findAllCompras(filtro);
    },

    compra: async ({ id }) => {
        return servicioCompra.findCompraById(id);
    },

    createCompra: async ({ id, email_cliente, curso_id, fecha }) => {
        return servicioCompra.createCompra(id, email_cliente, curso_id, fecha);
    },

    updateCompra: async ({ updateCompra }) => {
        return servicioCompra.updateCompra(updateCompra);
    },

    deleteCompra: async ({ id }) => {
        return servicioCompra.deleteCompra(id);
    }
};

