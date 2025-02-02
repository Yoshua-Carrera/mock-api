export const defaultMockUsername: string = "_default"
export const orchestratedKey: string = "orchestrated"

export enum RequestOperation {
  GET = 'get',
  POST = 'post'
}

export type ApiVersion = "v1" | "v2"

export interface V1ApiContext {
  params: Promise<{
    v1: string[]
  }>
}

export interface V2ApiContext {
  params: Promise<{
    graphql: string[]
  }>
}
