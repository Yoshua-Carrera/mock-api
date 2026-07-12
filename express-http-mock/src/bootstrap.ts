import express from 'express'
import cors from 'cors'
import { createGqlServer } from './graphql'
import { restHandler } from './rest'

export async function bootstrap() {
  const PORT = process.env.PORT || 8080
  const app = express()
  const gqlServer = await createGqlServer()

  app.use(express.json())

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    }),
  )

  gqlServer.applyMiddleware({ app, path: '/graphql-sandbox' })

  app.all(/(.*)/, restHandler)

  app.listen(PORT, () => {
    console.info(`Server is running on port: ${PORT}`)
  })
}
