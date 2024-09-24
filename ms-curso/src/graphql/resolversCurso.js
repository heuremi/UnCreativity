import { ServicioCurso } from "../services/servicio-curso.js";

const servicioCurso = new ServicioCurso()

export const resolvers = {
    cursos: async ({ filtro }) => {
        return servicioCurso.findAllCursos(filtro)
    },
    curso: async ({ id }) => {
        return servicioCurso.findCursoById(id)
    },

    createCurso: async ({ id, titulo, autor, categoria, rate }) => {
        return servicioCurso.createCurso(id, titulo, autor, categoria, rate)
    },

    updateCurso: async ({ updateCurso }) => {
        return servicioCurso.updateCurso(updateCurso)
    },

    deleteCurso: async ({ id }) => {
        return servicioCurso.deleteCurso(id)
    }
}

