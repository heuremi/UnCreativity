import express from 'express'
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql'
import { schemaCliente } from './graphql/schemas/schemaCliente.js'
import { schemaCompra } from './graphql/schemas/schemaCompra.js'
import { resolversCliente } from './graphql/resolvers/resolversCliente.js'
import { resolversCompra } from './graphql/resolvers/resolversCompra.js'
import webpayPlusRouter from './rest/routes/webpay-routes.js'
import bodyParser from 'body-parser'
import 'dotenv/config'

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
};


console.log(process.env?.FRONT_URL)

app.use(cors(corsOptions)); 

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