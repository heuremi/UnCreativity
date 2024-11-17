import { buildSchema } from 'graphql'

export const schemaCompra = buildSchema(`
    
    type Compra {
        id: Int
        clienteId: Int!
        cursoId: Int!
        fecha: String!
    }

    input SearchCompraInput {
        id: Int
        clienteId: Int
        cursoId: Int
        fecha: String
    }

    input CompraInput {
        clienteId: Int!
        cursoId: Int!
        fecha: String!
    }
        
    input UpdateCompraInput {
        id: Int!
        clienteId: Int
        cursoId: Int
        fecha: String
    }

    type Query {
        compras(filtro: SearchCompraInput): [Compra]
        compra(id: Int!): Compra
    }

    type Mutation {
        createCompra(datosCompra: CompraInput!): Compra
        updateCompra(datosActualizarCompra: UpdateCompraInput): Compra
        deleteCompra(id: Int!): Boolean

    }
`);
