const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const PORT = 5050

const app = express()

const schema = gql`
    type Query {
        users: [User!]
        user(id: ID!): User

        messages: [Message!]
        message(id: ID!): Message
    }

    type Mutation {
        createMessage(text: String!): Message!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int!
        messages: [Message!]
    }

    type Message {
        id: ID!
        text: String!
        user_id: ID!
    }
`
let id = 1
let users = [
    {id: id++, name: 'Diwash', email: 'diwash@mail.com', age: 28},
    {id: id++, name: 'aakash', email: 'aakash@mail.com', age: 28},
    {id: id++, name: 'Banks', email: 'Banks@mail.com', age: 28},
    {id: id++, name: 'Prishu', email: 'prishu@mail.com', age: 28}
]

let messageId = 1
let messages = [
    {id: messageId++, text: 'hello everyone', user_id: 3},
    {id: messageId++, text: 'what up', user_id: 1},
    {id: messageId++, text: 'sup', user_id: 2}
]

const resolvers = {
    Query: {
        users: (parent, args, ctx) => {
            return users
        },
        user: (_, { id }) => {
            let user = users.find(user => +user.id === +id)
            return user
        },

        messages: () => {
            return messages
        },
        message: (_, { id }) => {
            let message = messages.find(message => +message.id === +id)
            return message
        }
    },

    Mutation: {
        createMessage: (_, { text }) => {
            let message = {
                id: messageId++,
                text,
                user_id: users[0].id
            }

            messages.push(message)
            
            return message
        }
    },

    User: {
        messages: (user) => {
            return messages.filter(message => +message.user_id === +user.id)
        }
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers
})

server.applyMiddleware({ app, path: '/graphql'})

app.listen(PORT, () => {
    console.log(`apollo server on http://localhost:${PORT}${server.graphqlPath}`)
})