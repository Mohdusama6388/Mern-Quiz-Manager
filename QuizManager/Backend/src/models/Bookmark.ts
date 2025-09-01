
// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface IBookmark extends Document {
//   userId: mongoose.Types.ObjectId; 
//   quizId: mongoose.Types.ObjectId;  
//   question_number: number;
//   questionText?: string; 
// }

// const BookmarkSchema = new Schema(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
//     question_number: { type: Number, required: true },
//     questionText: { type: String }
//   },
//   { timestamps: true }
// );

// // Model creation with type
// const Bookmark: Model<IBookmark> = mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

// export default Bookmark;
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId; 
  quizId: mongoose.Types.ObjectId;  
  question_number: number;
  questionText?: string; 
}

const BookmarkSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    question_number: { type: Number, required: true },
    questionText: { type: String }
  },
  { timestamps: true }
);

const Bookmark: Model<IBookmark> = mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;
