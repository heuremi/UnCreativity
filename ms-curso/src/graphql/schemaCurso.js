import { buildSchema } from 'graphql'

export const schemaCurso = buildSchema(`
    input SearchCursoInput {
        id: Int
        titulo: String
        autor: String
        minRate: Int
        maxRate: Int
        categoria: String
    }

    input CursoInput {
        id: Int!
        titulo: String
        autor: String
        rate: Float
        categoria: String
    }

    type Curso {
        id: ID!
        titulo: String!
        descripcion: String
        autor: String
        imagenUrl: String
        rate: Float
        categoria: String!
    }

    type Query {
        cursos(filtro: SearchCursoInput): [Curso]
        curso(id: ID!): Curso
    }

    type Mutation {
        createCurso(id: ID!, titulo: String!, autor: String!, categoria: String!, rate: Float): Curso
        updateCurso(updateCurso: CursoInput): Curso
        deleteCurso(id: ID!): Curso

    }
`);
