import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { Quiz } from '../models/Quiz';
import { QuizAttempt } from '../models/QuizAttempt';
import { User } from '../models/User';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user!.id);

  const [
    availableQuizzesCount,
    categoriesCount,
    completedAttempts,
    recentAttempts,
    categoryPerformance,
    recommendedQuizzes,
  ] = await Promise.all([
    Quiz.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    QuizAttempt.find({
      user: userId,
      status: { $in: ['submitted', 'auto_submitted'] },
    })
      .select('percentage scoredMarks totalMarks passed submittedAt')
      .lean(),
    QuizAttempt.find({
      user: userId,
      status: { $in: ['submitted', 'auto_submitted'] },
    })
      .populate('quiz', 'title slug difficulty')
      .populate('category', 'name slug color')
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('-answers')
      .lean(),
    QuizAttempt.aggregate([
      {
        $match: {
          user: userId,
          status: { $in: ['submitted', 'auto_submitted'] },
        },
      },
      {
        $group: {
          _id: '$category',
          avgScore: { $avg: '$percentage' },
          attempts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryName: '$category.name',
          color: '$category.color',
          avgScore: { $round: ['$avgScore', 1] },
          attempts: 1,
        },
      },
      { $sort: { avgScore: -1 } },
    ]),
    Quiz.find({ isActive: true, questionCount: { $gt: 0 } })
      .populate('category', 'name slug color icon')
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
  ]);

  const totalAttempts = completedAttempts.length;
  const passedCount = completedAttempts.filter((a) => a.passed).length;
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          (completedAttempts.reduce((sum, a) => sum + a.percentage, 0) /
            totalAttempts) *
            10
        ) / 10
      : 0;
  const bestScore =
    totalAttempts > 0
      ? Math.max(...completedAttempts.map((a) => a.percentage))
      : 0;

  const scoreTrend = recentAttempts
    .slice()
    .reverse()
    .map((a) => ({
      quiz: (a.quiz as unknown as { title?: string })?.title?.slice(0, 18) || 'Quiz',
      score: a.percentage,
    }));

  sendSuccess(res, 200, 'Student dashboard fetched successfully', {
    stats: {
      totalAttempts,
      passedCount,
      averageScore,
      bestScore,
      availableQuizzesCount,
      categoriesCount,
    },
    recentAttempts,
    categoryPerformance,
    scoreTrend,
    recommendedQuizzes,
  });
});

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalStudents,
    activeStudents,
    totalQuizzes,
    activeQuizzes,
    totalCategories,
    completedAttemptsStats,
    recentAttempts,
    popularQuizzes,
    categoryAnalytics,
    dailyAttemptsTrend,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'student', isActive: true }),
    Quiz.countDocuments({}),
    Quiz.countDocuments({ isActive: true }),
    Category.countDocuments({}),
    QuizAttempt.aggregate<{
      _id: null;
      totalAttempts: number;
      avgPercentage: number;
      passedAttempts: number;
      autoSubmitted: number;
    }>([
      { $match: { status: { $in: ['submitted', 'auto_submitted'] } } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          avgPercentage: { $avg: '$percentage' },
          passedAttempts: { $sum: { $cond: ['$passed', 1, 0] } },
          autoSubmitted: {
            $sum: { $cond: [{ $eq: ['$status', 'auto_submitted'] }, 1, 0] },
          },
        },
      },
    ]),
    QuizAttempt.find({ status: { $in: ['submitted', 'auto_submitted'] } })
      .populate('user', 'name email')
      .populate('quiz', 'title difficulty')
      .populate('category', 'name color')
      .sort({ submittedAt: -1 })
      .limit(8)
      .select('-answers')
      .lean(),
    QuizAttempt.aggregate([
      { $match: { status: { $in: ['submitted', 'auto_submitted'] } } },
      {
        $group: {
          _id: '$quiz',
          attempts: { $sum: 1 },
          avgScore: { $avg: '$percentage' },
          passCount: { $sum: { $cond: ['$passed', 1, 0] } },
        },
      },
      { $sort: { attempts: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: '_id',
          as: 'quiz',
        },
      },
      { $unwind: '$quiz' },
      {
        $project: {
          _id: 0,
          quizId: '$_id',
          title: '$quiz.title',
          difficulty: '$quiz.difficulty',
          attempts: 1,
          avgScore: { $round: ['$avgScore', 1] },
          passRate: {
            $round: [{ $multiply: [{ $divide: ['$passCount', '$attempts'] }, 100] }, 1],
          },
        },
      },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: { $in: ['submitted', 'auto_submitted'] } } },
      {
        $group: {
          _id: '$category',
          attempts: { $sum: 1 },
          avgScore: { $avg: '$percentage' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          name: '$category.name',
          color: '$category.color',
          attempts: 1,
          avgScore: { $round: ['$avgScore', 1] },
        },
      },
      { $sort: { attempts: -1 } },
    ]),
    QuizAttempt.aggregate([
      { $match: { status: { $in: ['submitted', 'auto_submitted'] } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' },
          },
          attempts: { $sum: 1 },
          avgScore: { $avg: '$percentage' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 14 },
      {
        $project: {
          _id: 0,
          date: '$_id',
          attempts: 1,
          avgScore: { $round: ['$avgScore', 1] },
        },
      },
    ]),
  ]);

  const summary = completedAttemptsStats[0] ?? {
    totalAttempts: 0,
    avgPercentage: 0,
    passedAttempts: 0,
    autoSubmitted: 0,
  };

  const passRate =
    summary.totalAttempts > 0
      ? Math.round((summary.passedAttempts / summary.totalAttempts) * 1000) / 10
      : 0;

  sendSuccess(res, 200, 'Admin dashboard fetched successfully', {
    stats: {
      totalStudents,
      activeStudents,
      totalQuizzes,
      activeQuizzes,
      totalCategories,
      totalAttempts: summary.totalAttempts,
      averagePerformance: Math.round((summary.avgPercentage || 0) * 10) / 10,
      passRate,
      autoSubmittedCount: summary.autoSubmitted,
    },
    recentAttempts,
    popularQuizzes,
    categoryAnalytics,
    dailyAttemptsTrend,
  });
});
