export interface GenericMock {
  mockDelay?: number
  orchestratedMock?: GenericMock[]
  data: unknown
  error?: unknown
  default: GenericMock
}
