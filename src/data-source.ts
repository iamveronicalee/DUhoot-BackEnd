import { DataSource } from "typeorm";
import { Question } from "./entities/Question";
import { QuestionOption } from "./entities/QuestionOption";
import { Quiz } from "./entities/Quiz";
import { QuizDetail } from "./entities/QuizDetail";
import { QuizParticipant } from "./entities/QuizParticipant";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "tes",
    database: "duhoot",
    synchronize: true,
    logging: true,
    entities: [User, Quiz, QuizDetail, Question, QuestionOption, QuizParticipant],
    subscribers: [],
    migrations: [],
})