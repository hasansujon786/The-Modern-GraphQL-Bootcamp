import { GraphQLServer } from 'graphql-yoga'
import db from './db'
// Import Resolvers
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment
  },
  context: { db }
})

server.start({ port: 2000 }, ({ port }) => {
  console.log(`Server is running at http://localhost:${port}`)
})
