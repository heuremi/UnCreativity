import { Curso } from '../db/models/Curso.js'
import { Op } from 'sequelize'

export class ServicioCurso {

    constructor(){
        this.cursoModelo = Curso
    }

    async createCurso(id, titulo, autor, categoria, rate) {
        try {
            const curso = await this.cursoModelo.create({ id, titulo, autor, categoria, rate})
            return curso
        } catch (error) {
            throw new Error("Error creando el curso", error)
        }
    }

    async findCursoById(id) {
        try {
            return await this.cursoModelo.findByPk(id);
        } catch (error) {
            throw new Error("Erro obteniendo el curso con id: ", id)
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
            throw new Error("Error obteniendo cursos")
        }
    }

    async updateCurso(updateCurso) {
        console.log(updateCurso)
        Object.keys(updateCurso).forEach(key => updateCurso[key] === undefined ? delete updateCurso[key] : {});
        console.log(updateCurso)
        try {
            const curso = await this.cursoModelo.findByPk(updateCurso.id)
            curso.update(updateCurso)
            return curso
        } catch (error) {
            throw new Error("Error al actualizar el curso")
        }
    }

    async deleteCurso(id) {
        try {
            const curso = await this.cursoModelo.findByPk(id)
            curso.estaDelete = true
            curso.save()
            return curso
        } catch (error) {
            throw new Error("Error al actualizar el curso")
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