import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'https://eu1.prisma.sh/hasan-mahmud-c7cfac/prisma-graphql-api/dev'
})
