import 'reflect-metadata'
import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { MockResolver } from './resolvers/mock.resolver'

export async function createGqlServer(): Promise<ApolloServer<ExpressContext>> {
  const schema = await buildSchema({
    resolvers: [MockResolver],
    emitSchemaFile: {
      path: 'src/graphql/schema/schema.graphql',
    },
    skipCheck: true,
  })

  const gqlServer = new ApolloServer({
    schema,
    csrfPrevention: false,
    introspection: true,
  })

  await gqlServer.start()

  return gqlServer
}
