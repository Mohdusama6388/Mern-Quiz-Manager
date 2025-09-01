// import { Router } from "express";
// import { getQuestionByNumber, submitAnswerByNumber } from "../controllers/questionLog";
// import { isAuthenticated } from "../middlewares/isAuth";

// const router = Router();

// // GET question
// router.get("/:quizId/question/:question_number", isAuthenticated, getQuestionByNumber);

// // POST answer
// router.post("/:quizId/question/:question_number/answer", isAuthenticated, submitAnswerByNumber);

// export default router;

import { Router } from "express";
import { getQuestionByNumber, submitAnswerByNumber, getAllQuestionLogs } from "../controllers/questionLog";
import { isAuthenticated } from "../middlewares/isAuth";

const router = Router();

// Fetch a specific question and log displayedAt
router.get("/:quizId/:question_number", isAuthenticated, getQuestionByNumber);

// Submit answer and calculate timeTaken
router.post("/:quizId/:question_number/submit", isAuthenticated, submitAnswerByNumber);

// Fetch all question logs for a quiz and user
router.get("/:quizId/all", isAuthenticated, getAllQuestionLogs);

export default router;




