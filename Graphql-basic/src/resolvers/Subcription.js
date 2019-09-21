const Subscription = {
  count: {
    subscribe(parent, args, { pubSub }, info) {
      let count = 0

      setInterval(() => {
        count++
        pubSub.publish('count', { count })
      }, 1000)

      return pubSub.asyncIterator('count')
    }
  },
  comment: {
    subscribe(parent, { postId }, { db, pubSub }, info) {
      const foundPost = db.posts.find(post => post.id === postId && post.published)
      if (!foundPost) {
        throw new new Error('Post not found.')()
      }

      return pubSub.asyncIterator(`comment-${postId}`)
    }
  },
  post: {
    subscribe(parent, args, { pubSub }, info) {
      return pubSub.asyncIterator('post')
    }
  }
}

export { Subscription as default }
