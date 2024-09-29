import { buildSchema } from 'graphql'

export const schemaCliente = buildSchema(`

    type Cliente {
        email: String!
        nombre: String!
        apellido: String
        rut: String!
        telefono: String
        admin_S: Boolean!
        clave: String!
    }

    input SearchClienteInput {
        email: String
        nombre: String
        apellido: String
        rut: String
        telefono: String
        admin_S: Boolean
    }

    input ClienteInput {
        email: String!
        nombre: String!
        apellido: String
        rut: String!
        telefono: String
        admin_S: Boolean!
        clave: String!
    }
    
    input UpdateClienteInput {
        email: String!
        telefono: String
        admin_S: Boolean
        clave: String
    }

    type Query {
        clientes(filtro: SearchClienteInput): [Cliente]
        cliente(email: String!): Cliente
    }

    type Mutation {
        createCliente(datosCliente: ClienteInput): Cliente
        updateCliente(datosActualizarCliente: UpdateClienteInput): Cliente
        deleteCliente(email: String!): Cliente
    }
`);
