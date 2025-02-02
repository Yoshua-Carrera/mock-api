import "reflect-metadata"
import { ApolloServer, BaseContext } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { NextRequest } from "next/server"
import { buildSchema } from "type-graphql"
import { MockResolver } from "@/app/graphql/resolvers/mock.resolvers"

export const config = {
  api: {
    bodyParser: false
  }
}

const schema = await buildSchema({
  resolvers: [MockResolver],
  skipCheck: true,
})

const gqlServer = new ApolloServer({ schema, csrfPrevention: false })

const handler = startServerAndCreateNextHandler<NextRequest, BaseContext>(gqlServer, {
  context: async (req, context) => ({ req, context })
})

export { handler as GET, handler as POST }
