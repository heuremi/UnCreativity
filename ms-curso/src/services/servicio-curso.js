import { date } from 'yup'
import { Curso } from '../db/models/Curso.js'
import { Op, Sequelize } from 'sequelize'

export class ServicioCurso {

    constructor(){
        this.cursoModelo = Curso
    }
    async createCurso(input) {
        try {
            const curso = await this.cursoModelo.create(input)
            return curso
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
    }

    async createCursos(arrayInput) {
        try {
            const cursos = await this.cursoModelo.bulkCreate(arrayInput)
            return cursos 
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                throw new Error(`Error de Validación: ${error.message}`)
            } else if ( error instanceof Sequelize.DatabaseError) {
                throw new Error(`Error con la base de datos: ${error.nessage}`)
            } else {
                throw new Error(`Error inesperado: ${error.message}`)
            }
        }
    }

    async findCursoById(id) {
        try {
            return await this.cursoModelo.findByPk(id);
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                throw new Error(`Error de Validación: ${error.message} con el id ${id}`)
            } else if ( error instanceof Sequelize.DatabaseError) {
                throw new Error(`Error con la base de datos: ${error.nessage} con el id ${id}`)
            } else {
                throw new Error(`Error inesperado: ${error.message} con el id ${id}`)
            }
        }
    }

    async findAllCursos(filtros) {
        const condiciones = filtrarCursos(filtros);
        try {
            if(condiciones === null) return await Curso.findAll()
            else {
                return await Curso.findAll({
                    where: condiciones
                })
            }
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                throw new Error(`Error de Validación: ${error.message}`)
            } else if ( error instanceof Sequelize.DatabaseError) {
                throw new Error(`Error con la base de datos: ${error.nessage}`)
            } else {
                throw new Error(`Error inesperado: ${error.message}`)
            }
        }
    }

    async updateCurso(id, inputCurso) {
        Object.keys(inputCurso).forEach(key => inputCurso[key] === undefined ? delete inputCurso[key] : {});
        try {
            const curso = await this.cursoModelo.findByPk(id)
            curso.update(inputCurso)
            return curso
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                throw new Error(`Error de Validación: ${error.message} con el id ${id}`)
            } else if ( error instanceof Sequelize.DatabaseError) {
                throw new Error(`Error con la base de datos: ${error.nessage} con el id ${id}`)
            } else {
                throw new Error(`Error inesperado: ${error.message} con el id ${id}`)
            }
        }
    }

    async deleteCurso(id) {
        try {
            const curso = await this.cursoModelo.findByPk(id)
            curso.estaDelete = true
            curso.save()
            return curso
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                throw new Error(`Error de Validación: ${error.message} con el id ${id}`)
            } else if ( error instanceof Sequelize.DatabaseError) {
                throw new Error(`Error con la base de datos: ${error.nessage} con el id ${id}`)
            } else {
                throw new Error(`Error inesperado: ${error.message} con el id ${id}`)
            }
        }
    }
}

function filtrarCursos(filtro)
{
    const condiciones = {}
    if(filtro?.id){
        condiciones.id = filtro.id
    }
    if(filtro?.titulo){
        condiciones.titulo = {[Op.substring]: filtro.titulo}
    }
    if(filtro?.autor){
        condiciones.autor = {[Op.substring]: filtro.autor}
    }
    if(filtro?.categorias){
        condiciones.categorias = {[Op.overlap]: filtro.categorias}
    }
    if(filtro?.minRate || filtro?.maxRate){
        const minRate = filtro?.minRate ?? 0;
        const maxRate = filtro?.maxRate ?? 5;
        condiciones.calificacion = {[Op.between]: [minRate, maxRate]}
    }
    const sizeFiltros = Object.keys(condiciones).length
    return (sizeFiltros == 0 ) ? null : condiciones 
}