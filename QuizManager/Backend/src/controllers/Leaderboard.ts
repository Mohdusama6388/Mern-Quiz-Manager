
import Leaderboard from "../models/Leaderboard";
import ProjectError from "../helper/error";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Save or update highest score for a quiz
export const saveScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, username, quizId, score, total } = req.body;

    if (!userId || !username || !quizId || score == null || total == null) {
      throw Object.assign(new ProjectError("Missing required fields"), { statusCode: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      throw Object.assign(new ProjectError("Invalid ID format"), { statusCode: 400 });
    }

    if (score < 0 || score > total) {
      throw Object.assign(new ProjectError("Invalid score"), { statusCode: 400 });
    }

    const existing = await Leaderboard.findOne({ userId, quizId });

    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.total = total;
        await existing.save();
      }
    } else {
      await new Leaderboard({ userId, username, quizId, score, total }).save();
    }

    res.json({ status: "success", message: "Score saved successfully" });
  } catch (error: any) {
    if (error.code === 11000) {
      error = Object.assign(new ProjectError("Score already exists"), { statusCode: 400 });
    }
    next(error);
  }
};

// Get top 10 leaderboard for a quiz
export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.query;

    if (!quizId || !mongoose.Types.ObjectId.isValid(String(quizId))) {
      throw Object.assign(new ProjectError("Invalid or missing quizId"), { statusCode: 400 });
    }

    const leaderboard = await Leaderboard.find({ quizId })
      .sort({ score: -1, updatedAt: 1 })
      .limit(10)
      .lean();

    res.json({ status: "success", data: leaderboard });
  } catch (error) {
    next(error);
  }
};
