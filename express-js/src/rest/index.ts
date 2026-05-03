import e from 'express'
import { processRequest } from '../utils/shared/shared.handler'
import { handleSuccessResponse } from '../utils/rest/rest.handler'
import { GenericMock } from '../models/response.models'

export const restHandler = async (req: e.Request, res: e.Response) => {
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
}
