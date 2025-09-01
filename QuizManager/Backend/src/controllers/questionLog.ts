
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Quiz from "../models/quiz";
import QuestionLog from "../models/questionLog";
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces"
export const getQuestionByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, question_number } = req.params;
    const userId = req.userId;

    if (!quizId || !question_number) throw new ProjectError("quizId and question_number are required");
    if (!userId) throw new ProjectError("User not authenticated");

    const qNum = parseInt(question_number, 10);
    if (!Number.isFinite(qNum)) throw new ProjectError("question_number must be an integer");

    const quizObjectId = new mongoose.Types.ObjectId(quizId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const quiz = await Quiz.findById(quizObjectId);
    if (!quiz) throw new ProjectError("Quiz not found");

    const question = quiz.questions_list.find(q => q.question_number === qNum);
    if (!question) throw new ProjectError("Question not found");

    // Upsert log with displayedAt
    await QuestionLog.findOneAndUpdate(
      { quizId: quizObjectId, userId: userObjectId, question_number: qNum },
      { displayedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).send({
      status: "success",
      message: "Question fetched",
      data: question,
    } as ReturnResponse);

  } catch (error) {
    console.error("Error in getQuestionByNumber:", error);
    next(error);
  }
};

export const submitAnswerByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, question_number } = req.params;
    const { answer } = req.body;
    const userId = req.userId;

    if (!quizId || !question_number || answer === undefined)
      throw new ProjectError("quizId, question_number and answer are required");
    if (!userId) throw new ProjectError("User not authenticated");

    const qNum = parseInt(question_number, 10);
    if (!Number.isFinite(qNum)) throw new ProjectError("question_number must be an integer");

    const quizObjectId = new mongoose.Types.ObjectId(quizId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    let log = await QuestionLog.findOne({ quizId: quizObjectId, question_number: qNum, userId: userObjectId });

    if (!log) {
      log = new QuestionLog({
        quizId: quizObjectId,
        userId: userObjectId,
        question_number: qNum,
        displayedAt: new Date(),
      });
    }

    const answeredAt = new Date();
    const timeTaken = log.displayedAt ? (answeredAt.getTime() - log.displayedAt.getTime()) / 1000 : 0;

    log.answeredAt = answeredAt;
    log.answer = answer;
    log.timeTaken = timeTaken;

    await log.save();

    res.status(200).send({
      status: "success",
      message: "Answer recorded",
      data: { timeTaken },
    } as ReturnResponse);

  } catch (error) {
    console.error("Error in submitAnswerByNumber:", error);
    next(error);
  }
};

// Get all question logs for a user for this quiz
export const getAllQuestionLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId;

    if (!quizId) throw new ProjectError("quizId is required");
    if (!userId) throw new ProjectError("User not authenticated");

    const quizObjectId = new mongoose.Types.ObjectId(quizId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const logs = await QuestionLog.find({ quizId: quizObjectId, userId: userObjectId })
      .select("-__v -createdAt -updatedAt");

    console.log("Fetched logs:", logs);

    res.status(200).send({
      status: "success",
      message: "Question logs fetched",
      data: logs,
    } as ReturnResponse);

  } catch (error) {
    console.error("Error in getAllQuestionLogs:", error);
    next(error);
  }
};
