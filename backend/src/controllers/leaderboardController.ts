import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { QuizAttempt } from '../models/QuizAttempt';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const quizId =
    typeof req.query.quizId === 'string' && mongoose.Types.ObjectId.isValid(req.query.quizId)
      ? new mongoose.Types.ObjectId(req.query.quizId)
      : null;
  const categoryId =
    typeof req.query.categoryId === 'string' &&
    mongoose.Types.ObjectId.isValid(req.query.categoryId)
      ? new mongoose.Types.ObjectId(req.query.categoryId)
      : null;
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const matchStage: Record<string, unknown> = {
    status: { $in: ['submitted', 'auto_submitted'] },
  };
  if (quizId) matchStage.quiz = quizId;
  if (categoryId) matchStage.category = categoryId;

  const entries = await QuizAttempt.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$user',
        attemptsCount: { $sum: 1 },
        passedCount: { $sum: { $cond: ['$passed', 1, 0] } },
        avgPercentage: { $avg: '$percentage' },
        bestPercentage: { $max: '$percentage' },
        totalScoredMarks: { $sum: '$scoredMarks' },
        avgTimeSeconds: { $avg: '$timeTakenSeconds' },
        lastAttemptAt: { $max: '$submittedAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $match: {
        'user.role': 'student',
        'user.isActive': true,
      },
    },
    {
      $sort: {
        totalScoredMarks: -1,
        avgPercentage: -1,
        avgTimeSeconds: 1,
      },
    },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        department: '$user.department',
        attemptsCount: 1,
        passedCount: 1,
        avgPercentage: { $round: ['$avgPercentage', 1] },
        bestPercentage: { $round: ['$bestPercentage', 1] },
        totalScoredMarks: 1,
        avgTimeSeconds: { $round: ['$avgTimeSeconds', 0] },
        lastAttemptAt: 1,
      },
    },
  ]);

  const ranked = entries.map((entry, idx) => ({
    rank: idx + 1,
    ...entry,
  }));

  sendSuccess(res, 200, 'Leaderboard fetched successfully', { leaderboard: ranked });
});
