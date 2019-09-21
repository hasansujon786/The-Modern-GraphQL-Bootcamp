import uuid from 'uuid/v4'

const Mutation = {
  createUser(parent, args, { db }, info) {
    const isEmailTaken = db.users.some(user => user.email === args.data.email)
    if (isEmailTaken) {
      throw new Error('Email Taken.')
    }

    const user = {
      id: uuid(),
      ...args.data
    }

    db.users.push(user)

    return user
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id)
    if (userIndex === -1) {
      throw new Error('User not found.')
    }
    // Delete the user
    const [deletedUser] = db.users.splice(userIndex, 1)
    // Delete the post
    db.posts = db.posts.filter(post => {
      const match = post.auther === args.id

      if (match) {
        // Delete the comment on the deleted post
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match
    })

    // Delete the comments from the deleted user
    db.comments = db.comments.filter(comment => comment.auther !== args.id)

    return deletedUser
  },

  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id)
    if (!user) throw new Error('User not found.')

    if (typeof data.email === 'string') {
      const isEmailTaken = db.users.some(user => user.email === data.email)

      if (isEmailTaken) throw new Error('The Email is alrady in use')

      user.email = data.email
    }

    if (typeof data.name === 'string') {
      user.name = data.name
    }

    if (typeof data.age !== undefined) {
      user.age = data.age
    }

    return user
  },

  createPost(parent, args, { db, pubSub }, info) {
    const userExits = db.users.some(user => user.id === args.data.auther)
    if (!userExits) {
      throw new Error('User not found.')
    }

    const post = {
      id: uuid(),
      ...args.data
    }
    db.posts.push(post)

    post.published ? pubSub.publish('post', { post: { method: 'CREATED', data: post } }) : null

    return post
  },

  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    // Delete post from array
    const [deletedPost] = db.posts.splice(postIndex, 1)

    // Delete the commets of the deleted post
    db.comments = db.comments.filter(comment => comment.post !== args.id)

    return deletedPost
  },

  updatePost(parent, { id, data }, { db, pubSub }, info) {
    const post = db.posts.find(post => post.id === id)
    const originalPost = { ...post }
    // throw an error if not found
    if (!post) {
      throw new Error('Post not found')
    }

    typeof data.title === 'string' ? (post.title = data.title) : ''
    typeof data.body === 'string' ? (post.body = data.body) : ''

    if (typeof data.published === 'boolean') {
      post.published = data.published

      if (originalPost.published && !post.published) {
        // deleted
        pubSub.publish('post', {
          post: {
            method: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        // created
        pubSub.publish('post', {
          post: {
            method: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      // updated
      pubSub.publish('post', {
        post: {
          method: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },

  createComment(parent, args, { db, pubSub }, info) {
    const userExits = db.users.some(user => user.id == args.data.auther)
    if (!userExits) {
      throw new Error('User not found.')
    }

    const postExitsAndPublished = db.posts.some(
      post => post.id === args.data.post && post.published
    )
    if (!postExitsAndPublished) {
      throw new Error('Unable to find post.')
    }

    const comment = {
      id: uuid(),
      ...args.data
    }
    db.comments.push(comment)
    pubSub.publish(`comment-${args.data.post}`, {
      comment: {
        method: 'CREATED',
        data: comment
      }
    })

    return comment
  },

  deleteComment(parent, args, { db, pubSub }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id)
    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    // Delete comment
    const [deletedComment] = db.comments.splice(commentIndex, 1)
    pubSub.publish(`comment-${deletedComment.post}`, {
      comment: {
        method: 'DELETED',
        data: deletedComment
      }
    })

    return deletedComment
  },

  updateComment(parent, { id, data }, { db, pubSub }, info) {
    const comment = db.comments.find(comment => comment.id === id)

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    pubSub.publish(`comment-${comment.post}`, {
      comment: {
        method: 'UPDATED',
        data: comment
      }
    })
    return comment
  }
}

export { Mutation as default }
