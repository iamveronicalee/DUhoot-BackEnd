import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./Question";
import { QuizDetail } from "./QuizDetail";

@ObjectType()
@Entity("QuestionOption")
export class QuestionOption extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: "question_id" })
  questionId!: number;

  @Field()
  @Column({ name: "option_description" })
  optionDescription: string;

  @Field()
  @Column({ name: "is_answer" })
  isAnswer: boolean;

  @Field(() => Question)
  question!: Question;
  @ManyToOne(() => Question, (question) => question.optionConnection)
  @JoinColumn({ name: "question_id" })
  questionConnection!: Promise<Question>;
}
