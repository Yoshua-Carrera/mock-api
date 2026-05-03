import { GenericMock } from '../../models/response.models'

export const processRequest = async (params: {
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
