import { Ctx, Query, Resolver } from "type-graphql";
import { Mock } from "../types/mock.types";
import { NextRequest } from "next/server";
import { BaseContext } from "@apollo/server";
import {
  defaultMockUsername,
  RequestOperation,
  V2ApiContext,
} from "@/app/models/handler";
import { filereader } from "@/app/utils/filereader";

@Resolver(Mock)
export class MockResolver {
  @Query(() => [Mock])
  async GetMock(
    @Ctx() ctx: { req: NextRequest; context: BaseContext & V2ApiContext }
  ): Promise<Mock[]> {
    const params = (await ctx.context.params).graphql.filter(
      (item) => item !== "graphql"
    );
    const mockUsername = ctx.req.headers.get("from");
    try {
      const file = await filereader(
        params,
        mockUsername,
        RequestOperation.POST,
        "v2"
      );
      return [
        {
          data: JSON.stringify(file.data),
          mockUsername: mockUsername,
          mockMatch: true,
          errors: null,
        },
      ];
    } catch {
      const file = await filereader(
        params,
        defaultMockUsername,
        RequestOperation.POST,
        "v2"
      );
      return [
        {
          data: JSON.stringify(file.data),
          mockUsername: "hi",
          mockMatch: false,
          errors: [{
            message: "Mock username not found",
            timeStamp: Date().valueOf(),
            endpoint: ctx.req.url,
          }],
        },
      ];
    }
  }
}
