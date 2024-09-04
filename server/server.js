const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')

const app = express();

const users = [];

app.use(bodyParser.json());

app.use(express.json())
app.use(cors())

app.use(
    '/graphql', 
    graphqlHTTP({
        schema: buildSchema(`
            type User {
                _id: ID!
                name: String!
                password: String!
                age: Int!
                email: String!
                phone: String!
            }

            input UserInput {
                name: String!
                password: String!
                age: Int!
                email: String!
                phone: String!
            }

            type RootQuery {
                users: [User!]!
            }

            type RootMutation {
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            users: () => {
                return users;
            },
            createUser: (args) => {
                const user = {
                    _id: Math.random().toString(),
                    name: args.userInput.name,
                    password: args.userInput.password,
                    age: +args.userInput.age,
                    email: args.userInput.email,
                    phone: args.userInput.phone
                };
                users.push(user);
                return user;
            }
        },
        graphiql: true
    })
);

app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

app.listen(4001, () => console.log("server on localhost 4001"));