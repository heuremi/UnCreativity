import { buildSchema } from 'graphql'

export const schemaCliente = buildSchema(`

    type Cliente {
        id: ID!
        email: String
        nombre: String
        apellido: String
        rut: String
        telefono: String
        admin_S: Boolean
        clave: String
    }

    input SearchClienteInput {
        id: ID
        email: String
        nombre: String
        apellido: String
        rut: String
        telefono: String
        admin_S: Boolean
    }

    input ClienteInput {
        email: String
        nombre: String
        apellido: String
        rut: String
        telefono: String
        admin_S: Boolean
        clave: String
    }
    
    input UpdateClienteInput {
        email: String!
        nombre: String,
        apellido: String,
        telefono: String,
        clave: String
    }

    type LoginResponse {
        success: Boolean
        id: Int!
    }

    type Query {
        clientes(filtro: SearchClienteInput): [Cliente]
        clienteByEmail(email: String!): Cliente
        clienteById(id: ID!): Cliente
    }

    type Mutation {
        createCliente(datosCliente: ClienteInput!): Cliente
        updateCliente(updateCliente: UpdateClienteInput): Cliente
        deleteCliente(id: ID!): Boolean
        login(email: String!, clave: String!): LoginResponse!
    }
`);
