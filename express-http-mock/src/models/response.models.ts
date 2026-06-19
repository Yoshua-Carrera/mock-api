export interface GenericMock {
  mockDelay?: number
  mockStatusCode?: number
  orchestratedMock?: GenericMock[]
  data: unknown
  error?: unknown
  default: GenericMock
}
