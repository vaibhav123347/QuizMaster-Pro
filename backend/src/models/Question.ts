import mongoose, { Document, Schema } from 'mongoose';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
  marks: number;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz reference is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [5, 'Question text must be at least 5 characters'],
      maxlength: [1000, 'Question text cannot exceed 1000 characters'],
    },
    options: {
      type: [String],
      required: [true, 'Exactly 4 options are required'],
      validate: {
        validator: (arr: string[]) =>
          Array.isArray(arr) &&
          arr.length === 4 &&
          arr.every((opt) => typeof opt === 'string' && opt.trim().length > 0),
        message: 'A question must contain exactly 4 non-empty options',
      },
    },
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct option index is required'],
      min: [0, 'Correct option index must be between 0 and 3'],
      max: [3, 'Correct option index must be between 0 and 3'],
      select: false,
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
      trim: true,
      maxlength: [1500, 'Explanation cannot exceed 1500 characters'],
      select: false,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    marks: {
      type: Number,
      required: [true, 'Question marks are required'],
      min: [1, 'Marks must be at least 1'],
      max: [20, 'Marks cannot exceed 20'],
      default: 1,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

questionSchema.index({ quiz: 1, isActive: 1, order: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ quiz: 1, text: 1 }, { unique: true });

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
