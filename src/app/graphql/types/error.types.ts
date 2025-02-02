import { Field, InterfaceType, ObjectType } from "type-graphql";

@ObjectType()
export class MockErrorDetails {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  timeStamp?: string;

  @Field(() => String, { nullable: true })
  endpoint?: string;
}

@InterfaceType()
export abstract class MockError {
  @Field(() => MockErrorDetails, { nullable: true })
  error?: MockErrorDetails
}
