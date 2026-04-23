import express from 'express'
import cors from 'cors'
import { createGqlServer } from './graphql'
import { GenericMock } from './models/response.models'
import { handleSuccessResponse, processRequest } from './utils/rest/rest.handler'

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

  gqlServer.applyMiddleware({ app, path: '/graphql' })

  app.all(/(.*)/, async (req, res) => {
    const mockFileName = req.headers['mockFile'] as string
    const result = await processRequest({
      route: `../../mocks/${req.method}${req.path}`,
      mockFileName,
      method: req.method,
    })

    if (result.error) {
      console.error(`[error - ${req.method}] ${(result.error as Error).message}`)
    }

    if (result.errorCode) {
      console.warn(
        `[warning - ${req.method}] Mock not found for mock username "${mockFileName ?? 'default'}, please add the mock at ./mocks/${req.method}/${req.path}/${mockFileName ?? 'default'}.json`,
      )
      res.sendStatus(result.errorCode)
    } else {
      handleSuccessResponse({
        req,
        res,
        mockFileName,
        staticResponse: result.staticResponse as GenericMock,
        path: `./mocks/${req.method}/${req.path}`,
      })
    }
  })

  app.listen(PORT, () => {
    console.info(`Server is running on port: ${PORT}`)
  })
}
