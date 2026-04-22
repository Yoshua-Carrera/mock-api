import { Ctx, Info, Query, Resolver } from 'type-graphql'
import { GenericMockType } from '../types/mock.types'
import type { GraphQlInfo, MockContext } from '../models/handler.models'
import { GenericMock } from '../../models/response.models'

@Resolver(GenericMockType)
export class MockResolver {
  @Query(() => [GenericMockType])
  async getMock(@Ctx() ctx: MockContext, @Info() info: GraphQlInfo): Promise<GenericMockType[]> {
    return mockFetch<GenericMockType[]>(info, ctx)
  }
}
async function mockFetch<_>(info: GraphQlInfo, ctx: MockContext): Promise<GenericMockType[]> {
  const operationType = info.operation.operation
  const operationName = info.operation.name.value
  const mockFileName = (ctx.req?.headers['mockFile'] as string) ?? '_default'
  const result = await processRequest({
    route: `../../mocks/graphql/${operationType}/${operationName}`,
    mockFileName,
    method: operationType,
  })
  console.log({
    result,
  })
  return graphFileReader(
    `../../mocks/graphql/${operationType}/${operationName}/${mockFileName}.json`,
  )
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
        `[warning - ${p.method}] Current Mock Username "${p.mockFileName}" could not be located at "${p.route}/${p.mockFileName}.json" using _default mock username instead, response will be queried at ${p.route}/_default.json.`,
      )
    }
    return { staticResponse: staticResponse.default }
  } catch (error: unknown) {
    return { error, errorCode: 404 }
  }
}
