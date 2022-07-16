import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Quiz } from "./Quiz";
import { Question } from "./Question";
import { QuestionOption } from "./QuestionOption";

@ObjectType()
@Entity("QuizDetail")
export class QuizDetail extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: "quiz_id" })
  quizId: number;

  @Field()
  @PrimaryColumn({name : "question_id"})
  questionId: number;

  @Field(()=> Question)
  @OneToOne(() => Question, (question) => question.quizDetail)
  @JoinColumn({name : "question_id"})
  question: Question;

  @Field(() => Quiz)
  quiz!: Quiz;
  @ManyToOne(() => Quiz, (quiz) => quiz.detailConnection)
  @JoinColumn({ name: "quiz_id" })
  quizConnection!: Promise<Quiz>;

}
