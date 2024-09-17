import { Curso } from '../db/models/Curso.js'
import { Op } from 'sequelize'

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
    if(filtro?.categoria){
        condiciones.categoria = filtro.categoria
    }
    if(filtro?.minRate || filtro?.maxRate){
        const minRate = filtro?.minRate ?? 0;
        const maxRate = filtro?.maxRate ?? 5;
        condiciones.rate = {[Op.between]: [minRate, maxRate]}
    }
    const sizeFiltros = Object.keys(condiciones).length
    return (sizeFiltros == 0 ) ? null : condiciones 
}

export const resolvers = {
    cursos: async ({filtro}) => {

        const condiciones = filtrarCursos(filtro);
        try {
            if(condiciones === null) return await Curso.findAll()
            else {
                return await Curso.findAll({
                    where: condiciones
                })
            }
        } catch (error) {
            throw new Error("Error obteniendo cursos")
        }
    },

    curso: async ({ id }) => {
        try {
            return await Curso.findByPk(id);
        } catch (error) {
            throw new Error("Error obteniendo el curso")
        }
    },

    createCurso: async ({ id, titulo, autor, categoria, rate }) => {
        try {
            const curso = await Curso.create({ id, titulo, autor, categoria, rate })
            return curso
        } catch (error) {
            throw new Error("Error creando el curso", error)
        }
    }
}

