import { Cliente } from '../db/models/Cliente.js'
import { Op } from 'sequelize'

export class ServicioCliente {

    constructor(){
        this.modeloCliente = Cliente;
    };

    async createCliente(email, nombre, apellido, rut, telefono, admin_S, clave) {
        try {
            const cliente = await this.modeloCliente.create({ email, nombre, apellido, rut, telefono, admin_S, clave });
            return cliente;
        } catch (error) {
            throw new Error(`Error creando el cliente: ${error.message}`);
        }
    };

    async findClienteByEmail(email) {
        try {
            const cliente = await this.modeloCliente.findOne({ where: { email } });
        
            if (!cliente) {
                console.log(`No se encontró ningún cliente con el email: ${email}`);
                return null;
            }
        
            console.log("Cliente encontrado:", cliente);
            return cliente;
        } catch (error) {
        console.error("Error obteniendo el cliente con correo:", email, error);
        throw error;
        }
    };

    async findAllClientes(filtros) {
        const condiciones = filtrarClientes(filtros);
        try {
            if(condiciones === null) {
                return await Cliente.findAll();
            } else {
                return await Cliente.findAll({
                    where: condiciones
                });
            }
        } catch (error) {
            throw new Error("Error obteniendo clientes");
        }
    };

    async updateCliente(updateCliente) {
        Object.keys(updateCliente).forEach(key => updateCliente[key] === undefined ? delete updateCliente[key] : {});
        try {
            const cliente = await this.modeloCliente.findByPk(updateCliente.email);
            cliente.update(updateCliente);
            return cliente;
        } catch (error) {
            throw new Error("Error al actualizar el cliente");
        }
    };

    async deleteCliente(email) {
        try {
            const cliente = await this.modeloCliente.findByPk(email);
            cliente.estaDelete = true;
            cliente.save();
            return cliente;
        } catch (error) {
            throw new Error("Error al eliminar cliente");
        }
    };
};

function filtrarClientes(filtro)
{
    const condiciones = {};
    if(filtro?.email){
        condiciones.email = {[Op.substring]: filtro.email};
    }
    if(filtro?.nombre){
        condiciones.nombre = {[Op.substring]: filtro.nombre};
    }
    if(filtro?.apellido){
        condiciones.apellido = {[Op.substring]: filtro.apellido};
    }
    if(filtro?.rut){
        condiciones.rut = {[Op.substring]: filtro.rut};
    }
    if(filtro?.telefono){
        condiciones.telefono = {[Op.substring]: filtro.telefono};
    }

    const sizeFiltros = Object.keys(condiciones).length;
    return (sizeFiltros == 0 ) ? null : condiciones ;
};