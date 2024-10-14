import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schemaCliente } from './graphql/schemaCliente.js'
import { schemaCompra } from './graphql/schemaCompra.js'
import { resolversCliente } from './graphql/resolversCliente.js'
import { resolversCompra } from './graphql/resolversCompra.js'
import webpayPlusRouter from './rest/routes/webpay-routes.js'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use("/webpay-plus/", webpayPlusRouter)

app.use('/graphql/usuario', graphqlHTTP({
    schema: schemaCliente,
    rootValue: resolversCliente,
    graphiql: true,
}));

app.use('/graphql/compra', graphqlHTTP({
    schema: schemaCompra,
    rootValue: resolversCompra,
    graphiql: true,
}));

app.get('/', (req, res) => {
    res.send('Denied Access');
})

export { app }