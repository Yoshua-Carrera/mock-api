import { V1ApiContext, defaultMockUsername, RequestOperation } from '@/app/models/handler'
import { filereader } from '@/app/utils/filereader'
import { NextResponse } from 'next/server'

export async function GET(request: Request, context: V1ApiContext) {
  const params: string[] = (await context.params).v1
  const mockUsername: string = request.headers.get('from') ?? defaultMockUsername
  try {
    const file = await filereader(params, mockUsername, RequestOperation.GET, 'v1')
    return NextResponse.json({
      mockUsername,
      data: file.data,
      mockMatch: true,
    })
  } catch {
    try {
      // mockUsername was provided but it did not match a mock
      const file = await filereader(params, defaultMockUsername, RequestOperation.GET, 'v1')
      return NextResponse.json({
        mockUsername,
        data: file.data,
        mockMatch: false,
      })
    } catch (error) {
      // MockUsername was provided or not, but operation has not been mocked
      return NextResponse.json({
        mockUsername,
        error,
        mockMatch: false,
        status: 404,
      })
    }
  }
}

export async function POST(request: Request, context: V1ApiContext) {
  const params: string[] = (await context.params).v1
  const mockUsername: string = request.headers.get('from') ?? defaultMockUsername
  try {
    const file = await filereader(params, mockUsername, RequestOperation.POST, 'v1')
    return NextResponse.json({
      mockUsername,
      data: file.data,
      mockMatch: true,
    })
  } catch {
    try {
      // mockUsername was provided but it did not match a mock
      const file = await filereader(params, defaultMockUsername, RequestOperation.POST, 'v1')
      return NextResponse.json({
        mockUsername,
        data: file.data,
        mockMatch: false,
      })
    } catch (error) {
      // MockUsername was provided or not, but operation has not been mocked
      return NextResponse.json({
        mockUsername,
        error,
        mockMatch: false,
        status: 404,
      })
    }
  }
}
