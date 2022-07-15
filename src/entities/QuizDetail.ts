import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Quiz } from "./Quiz";
import { Question } from "./Question";

@ObjectType()
@Entity("QuizDetail")
export class QuizDetail extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: "quiz_id" })
  quizId: number;

  @Field()
  @PrimaryColumn({ name: "question_id" })
  questionId: number;

  @Field(() => Quiz)
  quiz!: Quiz;
  @ManyToOne(() => Quiz, (quiz) => quiz.detailConnection)
  @JoinColumn({ name: "quiz_id" })
  quizConnection!: Promise<Quiz>;

  @Field(() => Question)
  question!: Question;
  @ManyToOne(() => Question, (question) => question.detailConnection)
  @JoinColumn({ name: "question_id" })
  questionConnection!: Promise<Question>;
}
