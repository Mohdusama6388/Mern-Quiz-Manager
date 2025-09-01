
import { NextFunction, Request, Response } from 'express';
import Quiz from '../models/quiz';
import Report from '../models/report';
import Leaderboard from '../models/Leaderboard';
import User from '../models/user';
import ProjectError from '../helper/error';
import { ReturnResponse } from "../utils/interfaces";

const startExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId, { name: 1, questions_list: 1, is_published: 1 });

        if (!quiz) {
            const err = new ProjectError("No quiz found");
            err.statusCode = 404;
            throw err;
        }
        if (!quiz.is_published) {
            const err = new ProjectError("Quiz is not published");
            err.statusCode = 405;
            throw err;
        }

        const resp: ReturnResponse = { status: "success", message: "Quiz", data: quiz };
        res.status(200).send(resp);
    } catch (error) {
        next(error);
    }
};

const submitExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quizId, attempted_question } = req.body;

        // Fetch quiz answers
        const quiz = await Quiz.findById(quizId, { answers: 1 });
        if (!quiz) return res.status(404).send({ status: "error", message: "Quiz not found" });

        const answers = quiz.answers || {};
        const userId = req.userId;

        // ✅ Fetch user name from User model
        const user = await User.findById(userId, { name: 1 });
        if (!user) throw new ProjectError("User not found");
        const username = user.name; // use `name` field

        const allQuestions = Object.keys(answers);
        const total = allQuestions.length;

        // Calculate score
        let score = 0;
        for (let i = 0; i < total; i++) {
            const question_number = allQuestions[i];
            if (attempted_question?.[question_number] === answers[question_number]) {
                score++;
            }
        }

        // Save report
        const report = new Report({ userId, quizId, score, total });
        const data = await report.save();

        // Save or update leaderboard
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

        res.status(200).send({
            status: "success",
            message: "Quiz submitted successfully",
            data: { total, score, resultId: data._id }
        });

    } catch (error) {
        next(error);
    }
};

export { startExam, submitExam };

