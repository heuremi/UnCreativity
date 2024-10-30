import { Cliente } from '../db/models/Cliente.js'
import { Op, Sequelize } from 'sequelize'

export class ServicioCliente {

    constructor(){
        this.modeloCliente = Cliente;
    };

    async createCliente(datosCliente) {
        try {
            const cliente = await this.modeloCliente.create(datosCliente);
            return cliente;
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                const detallesErrores = error.errors.map((e) => e.message).join(", ");
                throw new Error(`Error de validación al crear el cliente: ${detallesErrores}`);
            } else if ( error instanceof Sequelize.DatabaseError) {
                throw new Error(`Error con la base de datos: ${error.nessage}`)
            } else {
                throw new Error(`Error inesperado: ${error.message}`)
            }
        }
    };

    async findClienteByEmail(email) {
        try {
            const cliente = await this.modeloCliente.findOne({ where: { email } });
        
            if (!cliente) {
                console.log(`No se encontró ningún cliente con el email: ${email}`);
                return null;
            }
            return cliente;
        } catch (error) {
            throw error;
        }
    };

    async findClienteById(id) {
        try {
            const cliente = await this.modeloCliente.findOne({ where: { id } });
        
            if (!cliente) {
                console.log(`No se encontró ningún cliente con el id: ${id}`);
                return null;
            }
            console.log("Cliente encontrado:", cliente);
            return cliente;
        } catch (error) {
        console.error("Error obteniendo el cliente con id:", id, error);
        throw error;
        }
    }
 
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
            const cliente = await this.modeloCliente.findByPk(updateCliente.id);
            cliente.update(updateCliente);
            return cliente;
        } catch (error) {
            throw new Error("Error al actualizar el cliente");
        }
    };

    async deleteCliente(id) {
        try {
            const cliente = await this.modeloCliente.findByPk(id);
            if(!cliente) {
                return false
            }
            await cliente.destroy()
            return true
        } catch (error) {
            throw new Error("Error al eliminar cliente");
        }
    };
};

function filtrarClientes(filtro)
{
    const condiciones = {};
    if(filtro?.id) {
        condiciones.id = filtro.id;
    }
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