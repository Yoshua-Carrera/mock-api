import { Request, Response } from 'express'
import { GenericMock } from '../../models/response.models'
import { handleOrchestration } from '../../state/mock.state'

export const handleSuccessResponse = (p: {
  req: Request
  res: Response
  mockFileName?: string
  staticResponse: GenericMock
  path: string
}) => {
  let orchestratedResponse: GenericMock | null = null
  console.info(
    `[success - ${p.req.method} Mock found and returned for "${p.mockFileName ?? '_default'}" at ./mocks/${p.req.method}/${p.req.path}/${p.mockFileName ?? '_default'}.json`,
  )
  if (
    typeof p.staticResponse === 'object' &&
    p.staticResponse !== null &&
    p.staticResponse.orchestratedMock
  ) {
    orchestratedResponse = handleOrchestration({
      orchestratedResponse: p.staticResponse.orchestratedMock,
      path: p.path,
    })
  }

  const responseData = orchestratedResponse ?? p.staticResponse

  const body =
    typeof responseData === 'object' && responseData !== null && !Array.isArray(responseData)
      ? Object.fromEntries(
          Object.entries(responseData).filter(([key]) => !['mockDelay'].includes(key)),
        )
      : responseData

  const statusCode: number = typeof responseData === 'number' ? responseData : 200
  setTimeout(
    () => p.res.status(responseData.mockStatusCode ?? statusCode).send(body),
    typeof responseData === 'object' && responseData !== null && responseData.mockDelay
      ? (responseData.mockDelay ?? 0)
      : 0,
  )
}
