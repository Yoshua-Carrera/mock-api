import e from 'express'
import { GenericMock } from '../../models/response.models'
import { GenericMockType } from '../../graphql/types/mock.types'
import { handleOrchestration } from '../../state/mock.state'

export const processRequest = async (p: {
  route: string
  mockFileName: string
  method: string
}): Promise<{
  staticResponse?: GenericMock
  errorCode?: number
  error?: unknown
}> => {
  if (p.mockFileName) {
    try {
      const staticResponse: GenericMock = await import(`${p.route}/${p.mockFileName}.json`)
      return { staticResponse: staticResponse.default }
    } catch {
      return await processDefaultRequest(p)
    }
  } else {
    return await processDefaultRequest(p)
  }
}

export const processDefaultRequest = async (p: {
  route: string
  mockFileName: string
  method: string
}): Promise<{
  staticResponse?: GenericMock
  errorCode?: number
  error?: unknown
}> => {
  try {
    const staticResponse: GenericMock = await import(`${p.route}/_default.json`)
    if (p.mockFileName) {
      console.warn(
        `[warning - GraphQl ${p.method}] Current Mock Username "${p.mockFileName}" could not be located at "${p.route}/${p.mockFileName}.json" using _default mock username instead, response will be queried at ${p.route}/_default.json.`,
      )
    }
    return { staticResponse: staticResponse.default }
  } catch (error: unknown) {
    return { error, errorCode: 404 }
  }
}

export const handleSuccessResponse = async (p: {
  req: e.Request
  res: e.Response
  mockFileName?: string
  staticResponse: GenericMock
  route: string
}): Promise<GenericMockType> => {
  let orchestratedResponse: GenericMock | null = null
  console.info(
    `[success - GraphQl ${p.req.method} Mock found and returned for "${p.mockFileName ?? '_default'}" at ${p.route}/${p.mockFileName ?? '_default'}.json`,
  )
  if (
    typeof p.staticResponse === 'object' &&
    p.staticResponse !== null &&
    p.staticResponse.orchestratedMock
  ) {
    orchestratedResponse = handleOrchestration({
      orchestratedResponse: p.staticResponse.orchestratedMock,
      path: p.route,
    })
  }

  const responseData = orchestratedResponse ?? p.staticResponse

  const body =
    typeof responseData === 'object' && responseData !== null && !Array.isArray(responseData)
      ? Object.fromEntries(
          Object.entries(responseData).filter(([key]) => !['mockDelay'].includes(key)),
        )
      : responseData

  const delay =
    typeof responseData === 'object' && responseData !== null ? (responseData.mockDelay ?? 0) : 0

  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  return body as GenericMockType
}
