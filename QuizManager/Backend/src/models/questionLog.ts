
import mongoose from "mongoose";
const { Schema } = mongoose;

const questionLogSchema = new Schema(
  {
    quizId: { type: mongoose.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    question_number: { type: Number, required: true },
    displayedAt: { type: Date },
    answeredAt: { type: Date },
    answer: { type: String },
    timeTaken: { type: Number }, // in seconds
  },
  { timestamps: true }
);

const QuestionLog = mongoose.model("QuestionLog", questionLogSchema);
export default QuestionLog;
