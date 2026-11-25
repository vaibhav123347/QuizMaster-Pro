import mongoose, { Document, Schema } from 'mongoose';

export type AttemptStatus = 'in_progress' | 'submitted' | 'auto_submitted';

export interface IAttemptAnswer {
  question: mongoose.Types.ObjectId;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  marksAwarded: number;
  markedForReview: boolean;
}

export interface IQuizAttempt extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  status: AttemptStatus;
  startedAt: Date;
  expiresAt: Date;
  submittedAt?: Date;
  timeTakenSeconds: number;
  answers: IAttemptAnswer[];
  totalMarks: number;
  scoredMarks: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  passed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attemptAnswerSchema = new Schema<IAttemptAnswer>(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      min: 0,
      max: 3,
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    marksAwarded: {
      type: Number,
      default: 0,
    },
    markedForReview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'submitted', 'auto_submitted'],
      default: 'in_progress',
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    answers: {
      type: [attemptAnswerSchema],
      default: [],
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    scoredMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    correctCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    wrongCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    unansweredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        Reflect.deleteProperty(ret, '__v');
        return ret;
      },
    },
  }
);

quizAttemptSchema.index({ user: 1, quiz: 1, status: 1 });
quizAttemptSchema.index({ user: 1, createdAt: -1 });
quizAttemptSchema.index({ quiz: 1, status: 1, percentage: -1 });
quizAttemptSchema.index({ status: 1, createdAt: -1 });

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
