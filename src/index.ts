import express, { Request, response, Response } from 'express'
import cors from 'cors'

interface GenericMock {
  mockDelay?: number
  orchestratedMock?: GenericMock[]
  data: unknown
  error?: unknown
  default: GenericMock
}

const orchestratedMockState: { [key: string]: number } = {}

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  }),
)

const PORT = process.env.PORT || 8080

const processRequest = async (params: {
  route: string
  mockFileName: string
  method: string
}): Promise<{
  staticResponse?: GenericMock
  errorCode?: number
  error?: unknown
}> => {
  if (params.mockFileName) {
    try {
      const staticResponse: GenericMock = await import(
        `${params.route}/${params.mockFileName}.json`
      )
      return { staticResponse: staticResponse.default }
    } catch {
      return await processDefaultRequest(params)
    }
  } else {
    return await processDefaultRequest(params)
  }
}

const processDefaultRequest = async (params: {
  route: string
  mockFileName: string
  method: string
}): Promise<{
  staticResponse?: GenericMock
  errorCode?: number
  error?: unknown
}> => {
  try {
    const staticResponse: GenericMock = await import(`${params.route}/_default.json`)
    if (params.mockFileName) {
      console.warn(
        `[warning - ${params.method}] Current Mock Username "${params.mockFileName}" could not be located at "${params.route}/${params.mockFileName}.json" using _default mock username instead, response will be queried at ${params.route}/_default.json.`,
      )
    }
    return { staticResponse: staticResponse.default }
  } catch (error: unknown) {
    return { error, errorCode: 404 }
  }
}

const handleOrchestration = (p: {
  orchestratedResponse: GenericMock[]
  path: string
}): GenericMock => {
  switch (true) {
    case !Object.keys(orchestratedMockState).includes(p.path):
    case orchestratedMockState[p.path] === p.orchestratedResponse.length - 1:
      orchestratedMockState[p.path] = 0
      return p.orchestratedResponse[0]
    default:
      orchestratedMockState[p.path]++
      return p.orchestratedResponse[orchestratedMockState[p.path]]
  }
}

const handleSuccessResponse = (p: {
  req: Request
  res: Response
  mockFileName?: string
  staticResponse: GenericMock
  path: string
}) => {
  let orchestratedResponse: GenericMock | null = null
  console.info(
    `[success - ${p.req.method} Mock found and returned for "${p.mockFileName ?? '_default'}" at ./mocks/${p.req.method}/${p.req.path}/${p.mockFileName ?? '_default'}.json`,
  )
  if (
    typeof p.staticResponse === 'object' &&
    p.staticResponse !== null &&
    p.staticResponse.orchestratedMock
  ) {
    orchestratedResponse = handleOrchestration({
      orchestratedResponse: p.staticResponse.orchestratedMock,
      path: p.path,
    })
  }

  const responseData = orchestratedResponse ?? p.staticResponse

  const body =
    typeof responseData === 'object' && responseData !== null && !Array.isArray(responseData)
      ? Object.fromEntries(
          Object.entries(responseData).filter(([key]) => !['mockDelay'].includes(key)),
        )
      : responseData

  const statusCode: number = typeof responseData === 'number' ? responseData : 200
  setTimeout(
    () => p.res.status(statusCode).send(body),
    typeof responseData === 'object' && responseData !== null && responseData.mockDelay
      ? (responseData.mockDelay ?? 0)
      : 0,
  )
}

app.get('/graph', async (req, res) => {
  res.send('graph')
})

app.all(/(.*)/, async (req, res) => {
  const mockFileName = req.headers['mockFile'] as string
  const result = await processRequest({
    route: `./mocks/${req.method}/${req.path}`,
    mockFileName,
    method: req.method,
  })

  if (result.error) {
    console.error(`[error - ${req.method}] ${(result.error as Error).message}`)
  }

  if (result.errorCode) {
    console.warn(
      `[warning - ${req.method}] Mock not found for mock username "${mockFileName ?? 'default'}, please add the mock at ./mocks/${req.method}/${req.path}/${mockFileName ?? 'default'}.json`,
    )
    res.sendStatus(result.errorCode)
  } else {
    handleSuccessResponse({
      req,
      res,
      mockFileName,
      staticResponse: result.staticResponse as GenericMock,
      path: `./mocks/${req.method}/${req.path}`,
    })
  }
})

app.listen(PORT, () => {
  console.info(`Server is running on port: ${PORT}`)
})
