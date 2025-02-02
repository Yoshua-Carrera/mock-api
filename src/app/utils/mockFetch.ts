import { defaultMockUsername, GraphQlInfo, MockContext, RequestOperation } from '../models/handler'
import { filereader } from './filereader'

export const mockFetch = async <T = unknown>(info: GraphQlInfo, ctx: MockContext) => {
  const params = [info.fieldName]
  const mockUsername = ctx.req.headers.get('from')
  try {
    const file = await filereader(params, mockUsername, RequestOperation.POST, 'v2')
    return [
      {
        data: file.data,
        mockUsername: mockUsername,
        mockMatch: true,
        errors: null,
      },
    ] as T
  } catch {
    try {
      const file = await filereader(params, defaultMockUsername, RequestOperation.POST, 'v2')
      return [
        {
          data: file.data,
          mockUsername: defaultMockUsername,
          mockMatch: false,
          errors: [
            {
              message: 'Mock username not found',
              timeStamp: Date().valueOf(),
              endpoint: ctx.req.url,
            },
          ],
        },
      ] as T
    } catch (error) {
      return [
        {
          mockMatch: false,
          mockUsername: mockUsername ?? defaultMockUsername,
          errors: [
            {
              message: 'Mock not found',
              timeStamp: Date().valueOf(),
              endpoint: ctx.req.url,
            },
            { error: error },
          ],
        },
      ] as T
    }
  }
}
