import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
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

  @OneToOne(() => Question, (question) => question.quizDetail)
  @JoinColumn({ name: "question_id" })
  question: Question;
}
