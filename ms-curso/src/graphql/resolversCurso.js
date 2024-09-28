import { ServicioCurso } from "../services/servicio-curso.js";

const servicioCurso = new ServicioCurso()

export const resolvers = {
    cursos: async ({ filtro }) => {
        return servicioCurso.findAllCursos(filtro)
    },
    curso: async ({ id }) => {
        return servicioCurso.findCursoById(id)
    },

    createCurso: async ({ inputCurso }) => {
        return servicioCurso.createCurso(inputCurso)
    },

    createCursos: async ({ inputCursos }) => {
        return servicioCurso.createCursos(inputCursos)
    },
    
    updateCurso: async ({ id, inputCurso }) => {
        return servicioCurso.updateCurso(id, inputCurso)
    },

    deleteCurso: async ({ id }) => {
        return servicioCurso.deleteCurso(id)
    }
}

