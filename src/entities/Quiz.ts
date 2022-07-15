import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { QuizDetail } from "./QuizDetail";
import { QuizParticipant } from "./QuizParticipant";
import { User } from "./User";

@ObjectType()
@Entity("Quiz")
export class Quiz extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: "quiz_name" })
  quizName: string;

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Field()
  @Column({ name: "creator_id" })
  creatorId!: number;

  @Field(() => User)
  creator!: User;
  @ManyToOne(() => User, (creator) => creator.quizConnection)
  @JoinColumn({ name: "creator_id" })
  creatorConnection!: Promise<User>;

  @OneToMany(() => QuizDetail, (detail) => detail.quizConnection)
  detailConnection!: Promise<QuizDetail[]>;

  @OneToMany(
    () => QuizParticipant,
    (quizParticipant) => quizParticipant.quizConnection
  )
  quizParticipantConnection!: Promise<QuizParticipant[]>;
}
