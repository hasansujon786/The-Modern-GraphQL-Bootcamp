import { GraphQLServer } from 'graphql-yoga'
import uuid from 'uuid/v4'

// Scallar types - String, Boolean, Int, Float, ID

// demo data
const users = [
  { id: '1', name: 'Hasan', email: 'hasan@ex.com', age: 20, posts: ['1', '2'] },
  { id: '2', name: 'Kamal', email: 'kuddus@ex.com', posts: ['3'] },
  { id: '3', name: 'Sokin', email: 'sokina@ex.com' }
]
let posts = [
  {
    id: '1',
    title: 'twinkle twinkle',
    body: 'Twinklw twinkle little star, How I wonder what you are!',
    published: true,
    auther: '1'
  },
  {
    id: '2',
    title: 'Johny Johny',
    body: `Johny Johny. Yes papa! Eating suger? No papa. Telling lies? No papa. Open your mouth. Ha Ha Ha.`,
    published: false,
    auther: '1'
  },
  {
    id: '3',
    title: 'Hmumpty Dumpty',
    body: `Hmumpty Dumpty sat on a wall. Hmumpty Dumpty had a great fall. All the king's hourses and all the king's men could not put Hmumpty Dumpty togather again.`,
    published: true,
    auther: '2'
  }
]

let commentsArr = [
  { id: '1', text: 'amazing post 1', auther: '2', post: '1' },
  { id: '2', text: 'amazing post 2', auther: '2', post: '2' },
  { id: '3', text: 'amazing post 3', auther: '1', post: '3' },
  { id: '4', text: 'amazing post 4', auther: '1', post: '3' }
]

// Type definitions (shema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    auther: ID!
  }

  input CreateCommentInput {
    text: String!
    auther: ID!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    auther: User!
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    text: String!
    auther: User!
    post: Post!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    me() {
      return {
        id: 'abc123',
        name: 'Hasan Mahmud',
        email: 'hasan@gmail.com'
      }
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }

      return posts.filter(post => {
        const titleRes = post.title.toLowerCase().includes(args.query.toLowerCase())
        const bodyRes = post.body.toLowerCase().includes(args.query.toLowerCase())
        return titleRes || bodyRes
      })
    },
    post() {
      return {
        id: '34343fd',
        title: 'the post title',
        body: 'The post body.',
        published: false,
        auther: 3
      }
    },
    comments() {
      return commentsArr
    }
  },

  Mutation: {
    createUser(parent, args, ctx, info) {
      const isEmailTaken = users.some(user => user.email == args.data.email)
      if (isEmailTaken) {
        throw new Error('Email Taken.')
      }

      const user = {
        id: uuid(),
        ...args.data
      }

      users.push(user)

      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id)
      if (userIndex === -1) {
        throw new Error('User not found.')
      }
      // Delete the user
      const [deletedUser] = users.splice(userIndex, 1)
      // Delete the post
      posts = posts.filter(post => {
        const match = post.auther === args.id

        if (match) {
          // Delete the comment on the deleted post
          commentsArr = commentsArr.filter(comment => comment.post !== post.id)
        }

        return !match
      })

      // Delete the comments from the deleted user
      commentsArr = commentsArr.filter(comment => comment.auther !== args.id)

      return deletedUser
    },
    createPost(parent, args, ctx, info) {
      const userExits = users.some(user => user.id === args.data.auther)
      if (!userExits) {
        throw new Error('User not found.')
      }

      const post = {
        id: uuid(),
        ...args.data
      }
      posts.push(post)

      return post
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex(post => post.id === args.id)
      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      // Delete post
      const [deletedPost] = posts.splice(postIndex, 1)

      // Delete the commets of the deleted post
      commentsArr = commentsArr.filter(comment => comment.post !== args.id)

      return deletedPost
    },
    createComment(parent, args, ctx, info) {
      const userExits = users.some(user => user.id == args.data.auther)
      if (!userExits) {
        throw new Error('User not found.')
      }

      const postExitsAndPublished = posts.some(post => post.id === args.data.post && post.published)
      if (!postExitsAndPublished) {
        throw new Error('Unable to find post.')
      }

      const comment = {
        id: uuid(),
        ...args.data
      }
      commentsArr.push(comment)

      return comment
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = commentsArr.findIndex(comment => comment.id === args.id)
      if (commentIndex === -1) {
        throw new Error('Comment not found')
      }

      // Delete comment
      const [deletedComment] = commentsArr.splice(commentIndex, 1)

      return deletedComment
    }
  },

  Post: {
    auther(parent, args, ctx, info) {
      return users.find(user => {
        return user.id == parent.auther
      })
    },
    comments(parent, args, ctx, info) {
      return commentsArr.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.auther === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return commentsArr.filter(comment => {
        return parent.id === comment.auther
      })
    }
  },
  Comment: {
    auther(parent, args, ctx, info) {
      return users.find(user => user.id === parent.auther)
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('Server is running at http://localhost:4000')
})
