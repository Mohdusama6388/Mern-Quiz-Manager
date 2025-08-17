import express from 'express'
import {isAuthenticated} from '../middlewares/isAuth'
import { startExam,submitExam} from '../controllers/exam'
const router=express.Router();
router.get("/:quizId", isAuthenticated ,startExam);
router.post("/",isAuthenticated,submitExam)
export  default router;