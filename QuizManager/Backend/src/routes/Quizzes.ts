import { Router } from "express";
import { getMyQuizzes } from "../controllers/Quizzes";
import { isAuthenticated } from "../middlewares/isAuth";

const router = Router();

// User ke khud ke banaye quizzes
router.get("/my-quizzes", isAuthenticated, getMyQuizzes);

export default router;
