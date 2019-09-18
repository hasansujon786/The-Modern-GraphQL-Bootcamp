import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
// Import Resolvers
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subcription.js'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const pubSub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment
  },
  context: { db, pubSub }
})

server.start({ port: 4000 }, ({ port }) => {
  console.log(`Server is running at http://localhost:${port}`)
})
