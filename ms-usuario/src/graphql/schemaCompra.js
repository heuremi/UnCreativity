import { buildSchema } from 'graphql'

export const schemaCompra = buildSchema(`
    
    type Compra {
        id: ID!
        emailCliente: String!
        cursoId: ID!
        fecha: String!
    }

    input SearchCompraInput {
        id: ID
        emailCliente: String
        cursoId: ID
        fecha: String
    }

    input CompraInput {
        id: Int!
        emailCliente: String!
        cursoId: ID!
        fecha: String!
    }
        
    input UpdateCompraInput {
        id: Int!
        emailCliente: String
        cursoId: ID
        fecha: String
    }

    type Query {
        compras(filtro: SearchCompraInput): [Compra]
        compra(id: ID!): Compra
    }

    type Mutation {
        createCompra(datosCompra: CompraInput): Compra
        updateCompra(datosActualizarCompra: UpdateCompraInput): Compra
        deleteCompra(id: ID!): Compra

    }
`);
