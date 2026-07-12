import e from 'express'
import { processRequest } from '../utils/shared/shared.handler'
import { handleSuccessResponse } from '../utils/rest/rest.handler'
import { GenericMock } from '../models/response.models'

export const restHandler = async (req: e.Request, res: e.Response) => {
  if (req.body.operationName === 'IntrospectionQuery') return
  const mockFileName = req.headers['mockUserName'] as string
  const route =
    req.path === '/graphql'
      ? `../../mocks/graphql/${req.body.query ? 'query' : 'mutation'}/${req.body.operationName}`
      : `../../mocks/${req.method}${req.path}`
  const result = await processRequest({
    route,
    mockFileName,
    method: req.method,
  })

  if (result.error) {
    console.error(`[error - ${req.method}] ${(result.error as Error).message}`)
  }

  if (result.errorCode) {
    console.warn(
      `[warning - ${req.method}] Mock not found for mock username "${mockFileName ?? 'default'}, please add the mock at ${route}/${mockFileName ?? 'default'}.json`,
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
}
