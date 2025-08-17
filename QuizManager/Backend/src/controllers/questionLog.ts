import { Request, Response, NextFunction } from "express";
import Quiz from "../models/quiz";
import QuestionLog from "../models/questionLog";
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";

export const getQuestionByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, question_number } = req.params;   
    const userId = req.userId;

    if (!quizId || !question_number) {
      const err = new ProjectError("quizId and question_number are required");
      err.statusCode = 400;
      throw err;
    }

    const quiz = await Quiz.findOne(
      { _id: quizId, "questions_list.question_number": Number(question_number) },
      { "questions_list.$": 1 }
    );

    if (!quiz || quiz.questions_list.length === 0) {
      throw new ProjectError("Question not found");
    }

    const question = quiz.questions_list[0];

    
    await QuestionLog.findOneAndUpdate(
      { quizId, userId, question_number: Number(question_number) },
      { displayedAt: new Date() },
      { upsert: true, new: true }
    );

    const resp: ReturnResponse = {
      status: "success",
      message: "Question fetched",
      data: question,
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};


export const submitAnswerByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, question_number } = req.params;   
    const { answer } = req.body;
    const userId = req.userId;

    if (!question_number || answer === undefined) {
      const err = new ProjectError("question_number and answer are required");
      err.statusCode = 400;
      throw err;
    }

    const log = await QuestionLog.findOne({ quizId, question_number: Number(question_number), userId });
    if (!log) throw new ProjectError("No question log found");

    const answeredAt = new Date();
    const timeTaken = log.displayedAt
      ? (answeredAt.getTime() - log.displayedAt.getTime()) / 1000
      : null;

    log.answeredAt = answeredAt;
    log.answer = answer;
    log.timeTaken = timeTaken ?? undefined;

    await log.save();

    const resp: ReturnResponse = {
      status: "success",
      message: "Answer recorded",
      data: { timeTaken },
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};
