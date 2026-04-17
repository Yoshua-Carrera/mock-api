import { ApiVersion, JsonResponse, orchestratedKey, RequestOperation } from '../models/handler'
import { orchestrationState } from '../store/orchestration/orchestration-state'

export const filereader = async (
  params: string[],
  mockUsername: string,
  operation: RequestOperation,
  version: ApiVersion,
): Promise<JsonResponse> => {
  try {
    const v1Path: string = `${operation}/${params.join('/')}/${mockUsername}`
    const v2Path: string = `${params.join('/')}/${mockUsername}`
    const path = version === 'v1' ? v1Path : v2Path
    const file: JsonResponse = await import(`../mock/${version}/${path}.json`)
    if (Object.keys(file).includes(orchestratedKey)) {
      switch (true) {
        case !Object.keys(orchestrationState).includes(path):
        case orchestrationState[path] === file.orchestrated.length - 1:
          orchestrationState[path] = 0
          return file.orchestrated[0]
        default:
          orchestrationState[path]++
          return file.orchestrated[orchestrationState[path]]
      }
    }
    return file
  } catch {
    return null
  }
}
