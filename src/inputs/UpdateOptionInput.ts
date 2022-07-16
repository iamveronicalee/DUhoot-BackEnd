import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateOptionInput {
  @Field(() => Int)
  optionId!: number;

  @Field()
  optionDescription!: string;
}
