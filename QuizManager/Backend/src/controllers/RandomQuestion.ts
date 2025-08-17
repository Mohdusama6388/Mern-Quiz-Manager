import { Request, Response, NextFunction } from "express";
import Quiz from "../models/quiz";
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";
import { shuffleArray } from "../utils/RandomQuestion";

// Exported function
export const getRandomizedQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId, { name: 1, questions_list: 1, is_published: 1 });

    if (!quiz || !quiz.is_published) {
      const err = new ProjectError("Quiz not found or unpublished");
      err.statusCode = 404;
      throw err;
    }

    // Shuffle questions
    const randomizedQuestions = shuffleArray(quiz.questions_list);

    const resp: ReturnResponse = {
      status: "success",
      message: "Randomized quiz fetched successfully",
      data: {
        quizId: quiz._id,
        name: quiz.name,
        questions_list: randomizedQuestions
      }
    };

    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};
