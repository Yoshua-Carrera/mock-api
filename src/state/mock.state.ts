import { GenericMock } from '../models/response.models'

const orchestratedMockState: { [key: string]: number } = {}

export const handleOrchestration = (p: {
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
