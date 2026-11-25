import mongoose from 'mongoose';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';

export const syncQuizMetadata = async (
  quizId: string | mongoose.Types.ObjectId
): Promise<void> => {
  const objectId =
    typeof quizId === 'string' ? new mongoose.Types.ObjectId(quizId) : quizId;

  const stats = await Question.aggregate<{
    _id: mongoose.Types.ObjectId;
    questionCount: number;
    totalMarks: number;
  }>([
    { $match: { quiz: objectId, isActive: true } },
    {
      $group: {
        _id: '$quiz',
        questionCount: { $sum: 1 },
        totalMarks: { $sum: '$marks' },
      },
    },
  ]);

  const summary = stats[0] ?? { questionCount: 0, totalMarks: 0 };

  await Quiz.findByIdAndUpdate(objectId, {
    questionCount: summary.questionCount,
    totalMarks: summary.totalMarks,
  });
};
