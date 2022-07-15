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
  async deleteQuiz(@Arg("id") id: number) {
    const quiz = await Quiz.findOne({ where: { id } });
    if (!quiz) throw new Error("Quiz not found!");
    await quiz.remove();
    return true;
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
      questionId: question.id,
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
}
