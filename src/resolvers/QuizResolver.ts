import { Quiz } from "../entities/Quiz";
import { User } from "../entities/User";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateQuizInput } from "../inputs/CreateQuizInput";
import { UpdateQuizInput } from "../inputs/UpdateQuizInput";
import { CreateQuestionInput } from "../inputs/CreateQuestionInput";
import { Question } from "../entities/Question";
import { QuizDetail } from "../entities/QuizDetail";
import { QuestionOption } from "../entities/QuestionOption";
import { AppDataSource } from "../data-source";
import { QuizParticipant } from "../entities/QuizParticipant";
import { UpdateQuestionInput } from "../inputs/UpdateQuestionInput";

@Resolver()
export class QuizResolver {
  @Mutation(() => Quiz)
  async createQuiz(@Arg("data") data: CreateQuizInput) {
    const currentDate = new Date();
    const creator = await User.findOne({
      where: { userName: data.creatorUserName },
    });
    try {
      const quiz = Quiz.create({
        quizName: data.quizName,
        createdAt: currentDate,
        updatedAt: currentDate,
        creatorId: creator?.id,
        isStart: false,
        isFinished : false
      });

      await quiz.save();
      return quiz;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => Quiz)
  getQuizById(@Arg("id") id: number) {
    const quiz = Quiz.findOne({ where: { id } });
    if (!quiz) throw new Error("Quiz not found!");
    return quiz;
  }

  @Mutation(() => [Quiz!])
  getPersonQuizList(@Arg("userId") userId: number) {
    const quizList = Quiz.find({ where: { creatorId: userId } });
    return quizList;
  }

  @Query(() => String)
  async getQuizDetailById(@Arg("quizId") quizId: number) {
    const quizDetails = await AppDataSource.getRepository(QuizDetail)
      .createQueryBuilder("quizDetail")
      .leftJoinAndSelect("quizDetail.question", "question")
      .leftJoinAndSelect("question.optionConnection", "options")
      .where({ quizId: quizId })
      .getMany();

    return JSON.stringify(quizDetails);
  }

  @Mutation(() => Boolean)
  async updateQuiz(@Arg("data") data: UpdateQuizInput) {
    try {
      const currentDate = new Date();
      await AppDataSource.createQueryBuilder()
        .update(Quiz)
        .set({ quizName: data.quizName, updatedAt: currentDate })
        .where({ id: data.quizId })
        .execute();
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async updateQuizDetail(@Arg("data") data: UpdateQuestionInput) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(Question)
        .set({ questionDescription: data.questionDescription })
        .where({ id: data.questionId })
        .execute();

      let len = data.options.length;
      for (let i = 0; i < len; i++) {
        let option = data.options[i];
        await AppDataSource.createQueryBuilder()
          .update(QuestionOption)
          .set({ optionDescription: option.optionDescription, isAnswer: option.isAnswer })
          .where({ id: option.optionId })
          .execute();
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => [QuizParticipant])
  async getAllQuizParticipant(@Arg("userId") userId : number){

    let res = await AppDataSource.getRepository(QuizParticipant)
    .createQueryBuilder("qp")
    .leftJoinAndSelect("qp.quizConnection", "quizConnection")
    .where({
      participantId : userId
    }).getMany()

    // console.log(JSON.stringify(res))
    return res;
  }

  @Mutation(() => Boolean)
  async deleteQuiz(@Arg("quizId") quizId: number) {
    try {
      let questions = await AppDataSource.getRepository(QuizDetail)
        .createQueryBuilder("question")
        .where({ quizId: quizId })
        .getMany();

      let len = questions.length;
      for (let i = 0; i < len; i++) {
        let temp = questions[i];

        // delete semua option yang dimiliki question
        await AppDataSource.createQueryBuilder()
          .delete()
          .from(QuestionOption)
          .where({ questionId: temp.questionId })
          .execute();

        // delete question yang di QuizDetail
        await AppDataSource.createQueryBuilder()
          .delete()
          .from(QuizDetail)
          .where({ questionId: temp.questionId })
          .execute();

        // delete question sendiri
        await AppDataSource.createQueryBuilder()
          .delete()
          .from(Question)
          .where({ id: temp.questionId })
          .execute();
      }
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Quiz)
        .where({ id: quizId })
        .execute();
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteQuestion(@Arg("questionId") questionId: number) {
    try {
      // delete semua option yang dimiliki question
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(QuestionOption)
        .where({ questionId: questionId })
        .execute();
      // delete question yang di QuizDetail
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(QuizDetail)
        .where({ questionId: questionId })
        .execute();

      // delete question sendiri
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Question)
        .where({ id: questionId })
        .execute();
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  @Mutation(() => [QuizDetail!])
  async getAllQuizDetailById(@Arg("quizId") quizId: number) {
    let res = await AppDataSource.getRepository(QuizDetail)
      .createQueryBuilder("quizDetail")
      .leftJoinAndSelect("quizDetail.question", "question")
      .where({
        quizId: quizId,
      })
      .getMany();

    return res;
  }

  @Mutation(() => QuizDetail)
  async createQuizDetail(
    @Arg("quizId") quizId: number,
    @Arg("data") data: CreateQuestionInput
  ) {
    const question = Question.create({
      questionDescription: data.questionDescription,
    });
    await question.save();

    const detail = QuizDetail.create({
      quizId: quizId,
      question: question,
    });
    await detail.save();

    let len = data.options.length;
    for (let i = 0; i < len; i++) {
      let temp = data.options[i];
      const option = QuestionOption.create({
        questionId: question.id,
        optionDescription: temp.optionDescription,
        isAnswer: temp.isAnswer,
      });
      await option.save();
    }
    return detail;
  }



  @Mutation(() => Boolean)
  async createQuizParticipant(
    @Arg("quizId") quizId: number,
    @Arg("participantId") participantId: number
  ) {

    let quiz = await Quiz.findOne({
      where : {
        id : quizId
      }
    })

    // klo quiz gaada gabisa
    if (!quiz) return false;

    // klo udah dimulai gabisa join
    if (quiz.isStart == true) return false;

    const date = new Date();
    const quizParticipant = QuizParticipant.create({
      quizId: quizId,
      participantId: participantId,
      score: 0,
      participateDate: date,
    });
    await quizParticipant.save();

    return true;
  }

  @Mutation(() => String)
  async updateQuizParticipant(
    @Arg("quizId") quizId: number,
    @Arg("participantId") participantId: number,
    @Arg("score") score: number
  ) {
    try {
      await AppDataSource.createQueryBuilder()
        .update(QuizParticipant)
        .set({ score: score })
        .where({ quizId: quizId, participantId: participantId })
        .execute();
    } catch (err) {
      console.log(err);
      return "update quiz score error";
    }
    return score;
  }
}

