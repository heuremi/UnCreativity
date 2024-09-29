import { ServicioCliente } from "../services/servicio-cliente.js";

const servicioCliente = new ServicioCliente();

export const resolversCliente = {

    clientes: async (_, { filtro }) => {
        return servicioCliente.findAllClientes(filtro);
    },

    cliente: async (_, { email }) => {
        return servicioCliente.findClienteByEmail(email);
    },

    createCliente: async (_, { email, nombre, apellido, rut, telefono, admin_S, clave }) => {
        return servicioCliente.createCliente(email, nombre, apellido, rut, telefono, admin_S, clave);
    },

    updateCliente: async (_, { updateCliente }) => {
        return servicioCliente.updateCliente(updateCliente);
    },

    deleteCliente: async (_, { email }) => {
        return servicioCliente.deleteCliente(email);
    }
};

