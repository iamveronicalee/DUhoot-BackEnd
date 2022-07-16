import { InputType, Field, Int } from "type-graphql";
import { UpdateOptionInput } from "./UpdateOptionInput";

@InputType()
export class UpdateQuestionInput {
  @Field(() => Int)
  questionId!: number;

  @Field()
  questionDescription!: string;

  @Field(() => [UpdateOptionInput])
  options!: UpdateOptionInput[];
}
