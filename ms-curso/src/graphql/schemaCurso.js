import { buildSchema } from 'graphql'

export const schemaCurso = buildSchema(`
    input SearchCursoInput {
        id: Int
        titulo: String
        autor: String
        minRate: Int
        maxRate: Int
        categorias: [String]
    }

    input CursoInput {
        titulo: String
        subtitulo: String
        descripcion: String
        calificacion: Float
        autor: String
        idioma: String
        categorias: [String]
        precio: Float
        imagenUrl: String
    }

    type Curso {
        id: Int!
        titulo: String!
        subtitulo: String
        descripcion: String!
        calificacion: Float
        autor: String!
        idioma: String!
        categorias: [String!]!
        precio: Float
        imagenUrl: String!
    }

    type Query {
        cursos(filtro: SearchCursoInput): [Curso]
        curso(id: ID!): Curso
        cursosById(ids: [Int!]!): [Curso]
    }

    type Mutation {
        createCurso(inputCurso : CursoInput!): Curso
        createCursos(inputCursos : [CursoInput!]!) : [Curso]
        updateCurso(id: ID!, inputCurso: CursoInput!): Curso
        deleteCurso(id: ID!): Curso

    }
`);
