const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')

const app = express();

app.use(bodyParser.json());

app.use(
    '/graphql', 
    graphqlHTTP({
        schema: buildSchema(`
            type RootQuery {
                users: [String!]!
            }

            type RootMutation {
                createUser(name: String): String
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            users () {
                return ['Cokke', 'Remi', 'Ceci', 'Cris'];
            },
            createUser: (args) => {
                const userName = args.name;
                return userName;
            }
        },
        graphiql: true
    })
);

app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

app.listen(3000);