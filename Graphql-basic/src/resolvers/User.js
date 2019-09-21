const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter(post => {
      return post.auther === parent.id
    })
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter(comment => {
      return parent.id === comment.auther
    })
  }
}

export { User as default }
