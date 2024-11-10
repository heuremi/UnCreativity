import { ServicioCliente } from "../../services/servicio-cliente.js";

const servicioCliente = new ServicioCliente();

export const resolversCliente = {

    clientes: async ({ filtro }) => {
        return servicioCliente.findAllClientes(filtro);
    },

    clienteByEmail: async ({ email }) => {
        return servicioCliente.findClienteByEmail(email); 
    },

    clienteById: async ({ id }) => {
        return servicioCliente.findClienteById(id);
    },

    createCliente: async ({ datosCliente }) => {
        console.log(datosCliente)
        return servicioCliente.createCliente(datosCliente);
    },

    updateCliente: async ({ updateCliente }) => {
        return servicioCliente.updateCliente(updateCliente);
    },

    deleteCliente: async ({ id }) => {
        console.log(id)
        return servicioCliente.deleteCliente(id);
    },

    login: async ({ email, clave}) => {
        const usuario = await servicioCliente.findClienteByEmail(email);
        if (!usuario) {
            console.log('Usuario no encontrado.');
            return {
                success: false,
                id: -1,
            };
        }
        if (usuario.clave !== clave) {
            console.log('Contraseña incorrecta.');
            return {
                success: false,
                id: usuario.id,
            };
        }
        return {
            success: true,
            id: usuario.id,
        };
    },
};

