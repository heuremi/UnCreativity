import { ServicioCliente } from "../services/servicio-cliente.js";

const servicioCliente = new ServicioCliente();

export const resolversCliente = {

    clientes: async ({ filtro }) => {
        console.log(filtro)
        return servicioCliente.findAllClientes(filtro);
    },

    cliente: async ({ email }) => {
        console.log(email)
        return servicioCliente.findClienteByEmail(email);
    },

    createCliente: async ({ datosCliente }) => {
        console.log(datosCliente)
        return servicioCliente.createCliente(
            datosCliente.email, 
            datosCliente.nombre, 
            datosCliente.apellido, 
            datosCliente.rut, 
            datosCliente.telefono, 
            datosCliente.admin_S, 
            datosCliente.clave
        );
    },

    updateCliente: async ({ updateCliente }) => {
        console.log(updateCliente)
        return servicioCliente.updateCliente(updateCliente);
    },

    deleteCliente: async ({ email }) => {
        console.log(email)
        return servicioCliente.deleteCliente(email);
    }
};

