import { Ctx, Info, Query, Resolver } from 'type-graphql'
import { Mock } from '../types/mock.types'
import type { GraphQlInfo, MockContext } from '../models/handler.models'

@Resolver(Mock)
export class MockResolver {
  @Query(() => [Mock])
  async getMock(@Ctx() ctx: MockContext, @Info() info: GraphQlInfo): Promise<Mock[]> {
    return mockFetch<Mock[]>(info, ctx)
  }
}
function mockFetch<_>(info: GraphQlInfo, ctx: MockContext): Mock[] | PromiseLike<Mock[]> {
  console.log(info, ctx)
  throw new Error('Function not implemented.')
}
