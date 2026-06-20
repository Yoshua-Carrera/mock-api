import { Ctx, Info, Query, Resolver } from 'type-graphql'
import { Mock } from '../types/mock.types'
import { mockFetch } from '@/app/utils/mockFetch'
import type { GraphQlInfo, MockContext } from '@/app/models/handler'

@Resolver(Mock)
export class MockResolver {
  @Query(() => [Mock])
  async getMock(@Ctx() ctx: MockContext, @Info() info: GraphQlInfo): Promise<Mock[]> {
    return mockFetch<Mock[]>(info, ctx)
  }
}
