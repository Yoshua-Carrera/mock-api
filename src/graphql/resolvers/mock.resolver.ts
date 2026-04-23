import { Ctx, Info, Query, Resolver } from 'type-graphql'
import { GenericMockType } from '../types/mock.types'
import type { GraphQlInfo, MockContext } from '../models/handler.models'
import { GenericMock } from '../../models/response.models'
import { handleSuccessResponse, processRequest } from '../../utils/graph/graph.handler'

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
