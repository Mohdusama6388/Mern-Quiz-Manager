import { Router } from "express";
import { getQuestionByNumber, submitAnswerByNumber } from "../controllers/questionLog";
import { isAuthenticated } from "../middlewares/isAuth";

const router = Router();

// GET question
router.get("/:quizId/question/:question_number", isAuthenticated, getQuestionByNumber);

// POST answer
router.post("/:quizId/question/:question_number/answer", isAuthenticated, submitAnswerByNumber);

export default router;





