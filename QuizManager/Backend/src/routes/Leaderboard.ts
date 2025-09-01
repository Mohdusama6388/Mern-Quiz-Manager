import express from "express";
import { saveScore, getLeaderboard, getAllLeaderboards } from "../controllers/Leaderboard";
import { isAuthenticated } from "../middlewares/isAuth";

const router = express.Router();

router.post("/", isAuthenticated, saveScore);

// Global leaderboard
router.get("/", isAuthenticated, getAllLeaderboards);

// Specific quiz leaderboard
router.get("/:quizId", isAuthenticated, getLeaderboard);

export default router;
