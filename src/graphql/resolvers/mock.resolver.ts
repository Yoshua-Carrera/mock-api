import { Ctx, Info, Query, Resolver } from 'type-graphql'
import { GenericMockType } from '../types/mock.types'
import type { GraphQlInfo, MockContext } from '../models/handler.models'
import { GenericMock } from '../../models/response.models'
import e from 'express'
import { handleOrchestration } from '../../state/mock.state'

@Resolver(GenericMockType)
export class MockResolver {
  @Query(() => [GenericMockType])
  async getMock(@Ctx() ctx: MockContext, @Info() info: GraphQlInfo): Promise<GenericMockType[]> {
    return mockFetch<GenericMockType[]>(info, ctx)
  }
}
async function mockFetch<_>(info: GraphQlInfo, ctx: MockContext): Promise<GenericMockType[]> {
  const { req, res } = ctx
  const operationType = info.operation.operation
  const operationName = info.operation.name.value
  const mockFileName = (ctx.req?.headers['mockFile'] as string) ?? '_default'
  const result = await processRequest({
    route: `../../mocks/graphql/${operationType}/${operationName}`,
    mockFileName,
    method: operationType,
  })
  if (result.error) {
    console.error(`[error - GraphQl ${operationType}] ${(result.error as Error).message}`)
    return [
      {
        error: result.error,
        errorCode: result.errorCode,
      },
    ]
  } else {
    return [
      await handleSuccessResponse({
        req,
        res,
        mockFileName,
        staticResponse: result.staticResponse as GenericMock,
        route: `../../mocks/graphql/${operationType}/${operationName}`,
      }),
    ]
  }
}

export const graphFileReader = async (path: string): Promise<GenericMockType[]> => {
  const staticResponse: GenericMock = await import(path)
  return [
    {
      data: staticResponse.data,
      error: null,
    },
  ]
}

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
