import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quiz } from "./Quiz";
import { User } from "./User";

@ObjectType()
@Entity("QuizParticipant")
export class QuizParticipant extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: "quiz_id" })
  quizId: number;

  @Field()
  @Column({ name: "participant_id" })
  participantId!: number;

  @Field()
  @Column()
  score!: number;

  @Field()
  @CreateDateColumn({ name: "participate_date" })
  participateDate!: Date;

  @Field(() => User, {nullable : true})
  @ManyToOne(() => User, participant => participant.quizParticipantConnection)
  @JoinColumn({ name: "participant_id" })
  participantConnection!: Promise<User>;

  @Field(() => Quiz, {nullable : true})
  @ManyToOne(() => Quiz, quiz => quiz.quizParticipantConnection)
  @JoinColumn({ name: "quiz_id" })
  quizConnection!: Promise<Quiz>;
  
}
