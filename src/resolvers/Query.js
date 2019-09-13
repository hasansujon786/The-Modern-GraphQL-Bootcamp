const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users
    }
    return db.users.filter(user => {
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
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts
    }

    return db.posts.filter(post => {
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
    return db.commentr
  }
}

export { Query as default }
