

import mongoose from 'mongoose';


const { Schema } = mongoose;

const quizSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },
    questions_list: [{
        question_number:{
            type:Number,
            required:true
        },
        question:String,
        options:{

        }
    }],
    answers: {},
    created_by:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    is_published:{
        type:Boolean,
        default:false
    }
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
