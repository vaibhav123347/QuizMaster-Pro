import mongoose, { Document, Schema } from 'mongoose';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface IQuiz extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  difficulty: QuizDifficulty;
  durationMinutes: number;
  passingPercentage: number;
  totalMarks: number;
  questionCount: number;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      minlength: [3, 'Quiz title must be at least 3 characters'],
      maxlength: [120, 'Quiz title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Quiz slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Quiz description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Quiz duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    passingPercentage: {
      type: Number,
      default: 60,
      min: [1, 'Passing percentage must be at least 1'],
      max: [100, 'Passing percentage cannot exceed 100'],
    },
    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    questionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

quizSchema.index({ category: 1, isActive: 1 });
quizSchema.index({ difficulty: 1, isActive: 1 });
quizSchema.index({ title: 'text', description: 'text' });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
