import { Field, ObjectType } from 'type-graphql'
import { MockErrorDetails } from './error.types'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType()
export class Mock {
  @Field(() => GraphQLJSONObject, { nullable: true })
  data?: unknown

  @Field(() => String, { nullable: true })
  mockUsername: string

  @Field(() => Boolean, { nullable: true })
  mockMatch: boolean

  @Field(() => [MockErrorDetails], { nullable: true })
  errors?: MockErrorDetails[]
}
