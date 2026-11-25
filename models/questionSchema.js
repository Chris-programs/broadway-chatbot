import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
    },
  },
  {
    id: {
      type: Number,
      required: true,
    },
    question_cn: {
      type: String,
      required: true,
    },
    question_en: {
      type: String,
      required: true,
    },
    answer_cn: {
      type: String,
      required: true,
    },
    answer_en: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

export const Question = mongoose.model('Question', questionSchema);
