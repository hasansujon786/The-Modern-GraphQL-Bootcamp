import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'https://eu1.prisma.sh/hasan-mahmud-c7cfac/prisma-graphql-api/dev'
})

// prisma.query.users(null, '{id name email posts { id title }}').then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })
const formatJsonNlog = obj => {
  console.log(JSON.stringify(obj, undefined, 2))
}

const createPostForUser = async (autherId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        auther: { connect: { id: autherId } }
      }
    },
    '{id}'
  )

  const user = await prisma.query.user(
    {
      where: { id: autherId }
    },
    '{ id name email posts {id title published}}'
  )

  return user
}

const postDraft = {
  // title: 'updated post',
  // body: 'updated body text',
  published: false
}

// createPostForUser('ck0w5dnnv4rcr0b17c6s8m4mh', postDraft)
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2))
//   })
//   .catch(err => {
//     console.log(err)
//   })

const updatePostForUser = async (postId, data) => {
  const updatedPost = await prisma.mutation.updatePost(
    {
      where: { id: postId },
      data
    },
    '{id title published auther {id name}}'
  )

  // return user

  return updatedPost
}

updatePostForUser('ck0w5ez3z4ser0b17i65qu1ej', postDraft)
  .then(post => {
    formatJsonNlog(post)
  })
  .catch(err => console.log(err))
