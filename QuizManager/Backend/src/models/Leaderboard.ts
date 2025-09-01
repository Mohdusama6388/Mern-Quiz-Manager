import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    username: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

leaderboardSchema.index({ userId: 1, quizId: 1 }, { unique: true });

leaderboardSchema.pre("save", function (next) {
  if (this.score > this.total) {
    return next(new Error("Score cannot exceed total"));
  }
  next();
});

export default mongoose.model("Leaderboard", leaderboardSchema);
