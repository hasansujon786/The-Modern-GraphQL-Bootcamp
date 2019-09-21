const Comment = {
  auther(parent, args, { db }, info) {
    return db.users.find(user => user.id === parent.auther)
  },
  post(parent, args, { db }, info) {
    return db.posts.find(post => post.id === parent.post)
  }
}

export { Comment as default }
