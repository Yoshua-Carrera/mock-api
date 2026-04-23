import { Request, Response } from 'express'
import { GenericMock } from '../../models/response.models'
import { handleOrchestration } from '../../state/mock.state'

export const processRequest = async (params: {
  route: string
  mockFileName: string
  method: string
}): Promise<{
  staticResponse?: GenericMock
  errorCode?: number
  error?: unknown
}> => {
  if (params.mockFileName) {
    try {
      const staticResponse: GenericMock = await import(
        `${params.route}/${params.mockFileName}.json`
      )
      return { staticResponse: staticResponse.default }
    } catch {
      return await processDefaultRequest(params)
    }
  } else {
    return await processDefaultRequest(params)
  }
}

export const processDefaultRequest = async (params: {
  route: string
  mockFileName: string
  method: string
}): Promise<{
  staticResponse?: GenericMock
  errorCode?: number
  error?: unknown
}> => {
  try {
    const staticResponse: GenericMock = await import(`${params.route}/_default.json`)
    if (params.mockFileName) {
      console.warn(
        `[warning - ${params.method}] Current Mock Username "${params.mockFileName}" could not be located at "${params.route}/${params.mockFileName}.json" using _default mock username instead, response will be queried at ${params.route}/_default.json.`,
      )
    }
    return { staticResponse: staticResponse.default }
  } catch (error: unknown) {
    return { error, errorCode: 404 }
  }
}

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
    () => p.res.status(statusCode).send(body),
    typeof responseData === 'object' && responseData !== null && responseData.mockDelay
      ? (responseData.mockDelay ?? 0)
      : 0,
  )
}
