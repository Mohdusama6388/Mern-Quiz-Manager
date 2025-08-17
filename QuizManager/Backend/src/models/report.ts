import mongoose from 'mongoose';

const { Schema } = mongoose;

const reportSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      required:true
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,  
    }
  },
  { timestamps: true }
);

const Report = mongoose.model('report', reportSchema);
export default Report;