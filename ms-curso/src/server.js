import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schemaCurso } from './graphql/schemaCurso.js'
import { resolvers } from './graphql/resolversCurso.js'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())


app.use('/graphql', graphqlHTTP({
    schema: schemaCurso,
    rootValue: resolvers,
    graphiql: true,
}));

app.get('/', (req, res) => {
    res.send("Hola mundo")
})

export { app }
