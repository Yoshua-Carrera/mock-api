import { Field, ObjectType } from "type-graphql";
import { MockErrorDetails } from "./error.types";

@ObjectType()
export class Mock {
  @Field(() => String, { nullable: true })
  data?: string;

  @Field(() => String)
  mockUsername: string;

  @Field(() => Boolean)
  mockMatch: boolean;

  @Field(() => [MockErrorDetails], { nullable: true })
  errors?: MockErrorDetails[];
}
