interface JsonResponse {
  data: unknown,
  default: unknown,
  orchestrated?: JsonResponse[]
}

import { orchestratedKey, RequestOperation } from "../models/handler"
import { orchestrationState } from "../store/orchestration/orchestration-state"

export const filereader = async (params: string[], mockUsername: string, operation: RequestOperation): Promise<JsonResponse> => {
  const path: string = `${operation}/${params.join("/")}/${mockUsername}`
  const file: JsonResponse = await import(`../mock/${path}.json`)
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

}
