import express from "express";
import {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz
} from "../controllers/quiz";
import { getRandomizedQuiz}  from "../controllers/RandomQuestion";
import { isAuthenticated } from "../middlewares/isAuth";
import  {body }from "express-validator";

const router = express.Router();

// Create quiz
router.post(
  "/",
  isAuthenticated,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage("Please enter a valid name, minimum 10 characters long"),
    body("questions_list").custom((questions_list) => {
      if (questions_list.length === 0) {
        return Promise.reject("Enter at least 1 question!");
      }
      return true;
    }),
    body("answers").custom((answers) => {
      if (Object.keys(answers).length === 0) {
        return Promise.reject("Answer should not be empty");
      }
      return true;
    })
  ],
  createQuiz
);

router.get("/:quizId", isAuthenticated, getQuiz);

router.get("/:quizId/random", isAuthenticated, getRandomizedQuiz);

// Update quiz
router.put(
  "/",
  isAuthenticated,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage("Please enter a valid name, minimum 10 characters long"),
    body("questions_list").custom((questions_list) => {
      if (questions_list.length === 0) {
        return Promise.reject("Enter at least 1 question!");
      }
      return true;
    }),
    body("answers").custom((answers) => {
      if (Object.keys(answers).length === 0) {
        return Promise.reject("Answer should not be empty");
      }
      return true;
    })
  ],
  updateQuiz
);

// Delete quiz
router.delete("/:quizId", isAuthenticated, deleteQuiz);

// Publish quiz
router.patch("/publish", isAuthenticated, publishQuiz);

export default router;
