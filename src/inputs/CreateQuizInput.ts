import { InputType, Field } from "type-graphql";

@InputType()
export class CreateQuizInput {
  @Field()
  quizName: string;

  @Field()
  creatorUserName: string;
}