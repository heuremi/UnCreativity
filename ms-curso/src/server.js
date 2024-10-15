import express from 'express'
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql'
import { schemaCurso } from './graphql/schemaCurso.js'
import { resolvers } from './graphql/resolversCurso.js'
import bodyParser from 'body-parser'

const app = express()

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())


app.use('/graphql', graphqlHTTP({
    schema: schemaCurso,
    rootValue: resolvers,
    graphiql: true,
    formatError: (err) => {
        return {
            message: err.message
        }
    }
}));

app.get('/', (req, res) => {
    res.send("Hola mundo")
})

export { app }
