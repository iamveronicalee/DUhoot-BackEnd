import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Quiz } from "./Quiz";
import { QuizParticipant } from "./QuizParticipant";

@ObjectType()
@Entity("User")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: "user_name" })
  userName: string;

  @Field()
  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "binusian_id" })
  binusianId: string;

  @OneToMany(() => Quiz, (quiz) => quiz.creatorConnection)
  quizConnection!: Promise<Quiz[]>;

  @OneToMany(
    () => QuizParticipant,
    (quizParticipant) => quizParticipant.participantConnection
  )
  quizParticipantConnection!: Promise<QuizParticipant[]>;
}
