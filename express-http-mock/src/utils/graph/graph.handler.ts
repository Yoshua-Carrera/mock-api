import e from 'express'
import { GenericMock } from '../../models/response.models'
import { GenericMockType } from '../../graphql/types/mock.types'
import { handleOrchestration } from '../../state/mock.state'

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
