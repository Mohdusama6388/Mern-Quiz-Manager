import express from "express";
import { saveScore, getLeaderboard } from "../controllers/Leaderboard";
import { isAuthenticated } from "../middlewares/isAuth";


const router = express.Router();

// POST - Save or update score
router.post("/",isAuthenticated, saveScore);

// GET - Fetch top scores
router.get("/",isAuthenticated, getLeaderboard);

export default router;
