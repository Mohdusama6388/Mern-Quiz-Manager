
import { Request, Response, NextFunction } from "express";
import Quiz from "../models/quiz";
import { ReturnResponse } from "../utils/interfaces";
const getMyQuizzes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizzes = await Quiz.find(
      { created_by: req.userId },
      { name: 1, is_published: 1, created_by: 1, questions_list: 1 }
    );

    if (!quizzes || quizzes.length === 0) {
      const resp: ReturnResponse = {
        status: "success",
        message: "No quizzes found for this user",
        data: []
      };
      return res.status(200).send(resp);
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "User quizzes fetched successfully",
      data: quizzes
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

export { getMyQuizzes };
