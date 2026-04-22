import { Request } from 'express'

export interface MockContext {
  req: Request
  context: GraphqlContext
}

export interface GraphqlContext {
  params: Promise<{
    graphql: string[]
  }>
}

export interface GraphQlInfo {
  fieldName: string
  fieldNodes: FieldNode[]
  returnType: string
  parentType: string
  path: Path
  fragments: null
  rootValue: null
  operation: Operation
  variableValues: VariableValues
  cacheControl: null
}

export interface FieldNode {
  kind: string
  alias: null
  name: NameElement
  arguments: unknown[]
  directives: unknown[]
  selectionSet: unknown[]
  loc: unknown[]
}

export type NameElement = unknown

export interface Operation {
  kind: string
  operation: string
  name: PurpleName
  variableDefinitions: Array<NameElement[]>
  directives: unknown[]
  selectionSet: SelectionSet
  loc: LOC
}

export interface LOC {
  start: number
  end: number
}

export interface PurpleName {
  kind: string
  value: string
  loc: unknown[]
}

export interface SelectionSet {
  kind: string
  selections: unknown[]
  loc: NameElement[]
}

export interface Path {
  prev: string
  key: string
  typename: string
}

export interface VariableValues {
  testType: string
}
