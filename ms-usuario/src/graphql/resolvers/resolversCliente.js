import { ServicioCliente } from "../../services/servicio-cliente.js";

const servicioCliente = new ServicioCliente();

export const resolversCliente = {

    clientes: async ({ filtro }) => {
        return servicioCliente.findAllClientes(filtro);
    },

    cliente: async ({ email }) => {
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
    },

    login: async ({ email, clave}) => {
        console.log("email: ", email)
        console.log("clave:", clave)
        const usuario = await servicioCliente.findClienteByEmail(email);
        console.log("us: ",usuario?.dataValues?.clave)
        console.log(usuario?.dataValues?.email)
        if (!usuario) {
            console.log('Usuario no encontrado.');
            return false;
        }

        if (usuario.clave !== clave) {
            console.log('Contraseña incorrecta.');
            return false;
        }

        return true;
    },
};

