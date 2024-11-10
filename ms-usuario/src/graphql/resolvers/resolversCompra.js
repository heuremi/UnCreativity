import { ServicioCompra } from "../../services/servicio-compra.js";

const servicioCompra = new ServicioCompra();

export const resolversCompra = {

    compras: async ({ filtro }) => {
        return await servicioCompra.findAllCompras(filtro);
    },

    compra: async ({ id }) => {
        return await servicioCompra.findCompraById(id);
    },

    createCompra: async ({ datosCompra }) => {
        console.log(datosCompra)
        return await servicioCompra.createCompra( datosCompra );
    },

    updateCompra: async ({ updateCompra }) => {
        return await servicioCompra.updateCompra(updateCompra);
    },

    deleteCompra: async ({ id }) => {
        return await servicioCompra.deleteCompra(id);
    }
};

