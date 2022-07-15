import { Field, InputType } from "type-graphql";

@InputType()
export class CreateOptionInput {
  @Field()
  optionDescription: string;

  @Field()
  isAnswer: boolean;
}
