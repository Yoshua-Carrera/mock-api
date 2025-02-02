/* eslint-disable @typescript-eslint/no-unused-vars */
import { Arg, Ctx, Info, Query, Resolver } from 'type-graphql'
import type { GraphQlInfo, MockContext } from '@/app/models/handler'
import { Mock } from '../types/mock.types'
import { mockFetch } from '@/app/utils/mockFetch'

@Resolver(Mock)
export class TestingResolver {
  @Query(() => [Mock])
  async getTest(
    @Ctx() ctx: MockContext,
    @Info() info: GraphQlInfo,
    @Arg('testType', { defaultValue: null }) _testType: string,
  ): Promise<Mock[]> {
    return mockFetch<Mock[]>(info, ctx)
  }
}
