import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateQuizInput {
  @Field(() => Int)
  quizId: number;

  @Field()
  quizName!: string;
}
