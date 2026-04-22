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
  const mockFileName = ctx.req?.headers['mockFile'] ?? '_default'
  console.log(JSON.stringify(ctx))
  return graphFileReader(
    `../../mocks/graphql/${operationType}/${operationName}/${mockFileName}.json`,
  )
}

const graphFileReader = async (path: string): Promise<GenericMockType[]> => {
  console.log({
    path,
  })
  const staticResponse: GenericMock = await import(path)
  console.log({
    staticResponse,
  })

  return [
    {
      data: staticResponse.data,
      error: null,
    },
  ]
}
