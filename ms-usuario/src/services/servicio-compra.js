import { Compra } from '../db/models/Compra.js'
import { Op } from 'sequelize'

export class ServicioCompra {

    constructor(){
        this.modeloCompra = Compra;
    };

    async createCompra(id, emailCliente, cursoId, fecha) {
        try {
            const compra = await this.modeloCompra.create({ emailCliente, cursoId, fecha });
            return compra;
        } catch (error) {
            throw new Error(`Error creando la compra: ${error.message}`);
        }
    };

    async findCompraById(id) {
        try {
            return await this.modeloCompra.findByPk(id);
        } catch (error) {
            throw new Error("Error obteniendo la compra con id: ", id);
        }
    };

    async findAllCompras(filtros) {
        const condiciones = filtrarCompras(filtros);
        try {
            if(condiciones === null){ 
                return await Compra.findAll();
            }
            else {
                return await Compra.findAll({
                    where: condiciones
                });
            }
        } catch (error) {
            throw new Error("Error obteniendo compras");
        }
    };

    async updateCompra(updateCompra) {
        Object.keys(updateCompra).forEach(key => updateCompra[key] === undefined ? delete updateCompra[key] : {});
        try {
            const compra = await this.modeloCompra.findByPk(updateCompra.id);
            compra.update(updateCompra);
            return compra;
        } catch (error) {
            throw new Error("Error al actualizar la compra");
        }
    };

    async deleteCompra(id) {
        try {
            const Compra = await this.modeloCompra.findByPk(id);
            Compra.destroy();
            return;
        } catch (error) {
            throw new Error("Error al eliminar la compra");
        }
    }
};

function filtrarCompras(filtro)
{
    const condiciones = {};
    if(filtro?.id){
        condiciones.id = filtro.id;
    }
    if(filtro?.email_cliente){
        condiciones.email_cliente = {[Op.substring]: filtro.email_cliente};
    }
    if(filtro?.curso_id){
        condiciones.curso_id = filtro.curso_id;
    }
    if(filtro?.fecha){
        condiciones.fecha = {[Op.substring]: filtro.fecha};
    }
    const sizeFiltros = Object.keys(condiciones).length;
    return (sizeFiltros == 0 ) ? null : condiciones;
}