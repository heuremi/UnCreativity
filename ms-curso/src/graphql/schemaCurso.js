import { buildSchema } from 'graphql'

export const schemaCurso = buildSchema(`
    input SearchCurso {
        id: Int
        titulo: String
        autor: String
        minRate: Int
        maxRate: Int
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
        cursos(filtro: SearchCurso): [Curso]
        curso(id: ID!): Curso
    }

    type Mutation {
        createCurso(id: ID!, titulo: String!, autor: String!, categoria: String!, rate: Float): Curso
    }
`);
