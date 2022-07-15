import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { QuestionOption } from "./QuestionOption";
import { QuizDetail } from "./QuizDetail";

@ObjectType()
@Entity("QuizQuestion")
export class Question extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: "question_description" })
  questionDescription: string;

  @OneToMany(() => QuestionOption, (option) => option.questionConnection)
  optionConnection!: Promise<QuestionOption[]>;

  @OneToMany(() => QuizDetail, (detail) => detail.questionConnection)
  detailConnection!: Promise<QuizDetail[]>;
}
