import { QuestionOption } from "../entities/QuestionOption";
import { InputType, Field } from "type-graphql";
import { CreateOptionInput } from "./CreateOptionInput";

@InputType()
export class CreateQuestionInput {
  @Field()
  questionDescription: string;

  @Field(() => [CreateOptionInput])
  options!: CreateOptionInput[];
}
