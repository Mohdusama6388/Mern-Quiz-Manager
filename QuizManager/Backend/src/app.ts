
import express from "express";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";
import examRoute from "./routes/exam"
import mongoose from "mongoose";
import ProjectError from "./helper/error";
import quizRoute from './routes/quiz'
import  reportRoute from './routes/report'
import favQuestionRoute from './routes/favQuestion'
import  QuestionLogRoute from "./routes/questionlog";
import RandomQuestionRoute from "./routes/RandomQuestion"
import { Request,Response,NextFunction } from "express";
import {ReturnResponse} from "./utils/interfaces"
import LeaderboardRoute from "./routes/Leaderboard"

const app = express();


app.use(express.json());
declare global {
  namespace Express{
    interface Request{
      userId: String;
    }
  }
}

app.use('/user', userRoute);
app.use('/auth', authRoute);
app.use('/quiz',quizRoute)
app.use('/exam',examRoute)
app.use('/report',reportRoute)
app.use("/favquestion",favQuestionRoute);
app.use('/leaderboard',LeaderboardRoute)
app.use("/questionLog", QuestionLogRoute);
app.use("/RandomQuestion",RandomQuestionRoute);

app.use((err: ProjectError, req: Request, res: Response, next: NextFunction) => {
  const isClientError = err.statusCode && err.statusCode < 500;

  const statusCode = isClientError ? err.statusCode : 500;
  const message = isClientError ? err.message : "something went wrong please try after some time";

  const resp: ReturnResponse = {
    status: "error",
    message,
    data: err.data ?? {}
  };

  console.error(err);
  res.status(statusCode).json(resp);
});




const url =
  "mongodb+srv://mohdusama2362004:ABCD1234@cluster0.iglinrp.mongodb.net/quizapp?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3002, () => console.log("Server running on port 3002"));
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
