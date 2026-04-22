import { Field, ObjectType } from 'type-graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType()
export class GenericMockType {
  @Field(() => GraphQLJSONObject, { nullable: true })
  data?: unknown

  @Field(() => GraphQLJSONObject, { nullable: true })
  error?: unknown
}
