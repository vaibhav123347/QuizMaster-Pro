import { Request, Response } from 'express';
import { QuizAttempt } from '../models/QuizAttempt';
import {
  getAttemptResult,
  saveAttemptProgress,
  startOrResumeAttempt,
  submitQuizAttempt,
} from '../services/attemptService';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const startAttempt = asyncHandler(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const payload = await startOrResumeAttempt(req.user!.id, quizId);
  sendSuccess(
    res,
    payload.resumed ? 200 : 201,
    payload.resumed ? 'Resumed active quiz attempt' : 'Quiz attempt started',
    payload
  );
});

export const saveProgress = asyncHandler(async (req: Request, res: Response) => {
  const { attemptId } = req.params;
  const { answers } = req.body;
  const result = await saveAttemptProgress(attemptId, req.user!.id, answers);
  sendSuccess(res, 200, 'Progress saved', result);
});

export const submitAttempt = asyncHandler(async (req: Request, res: Response) => {
  const { attemptId } = req.params;
  const { answers, autoSubmitted } = req.body;
  const result = await submitQuizAttempt(
    attemptId,
    req.user!.id,
    answers,
    Boolean(autoSubmitted)
  );
  sendSuccess(res, 200, 'Quiz submitted and graded successfully', result);
});

export const getResultByAttemptId = asyncHandler(
  async (req: Request, res: Response) => {
    const { attemptId } = req.params;
    const result = await getAttemptResult(
      attemptId,
      req.user!.id,
      req.user!.role
    );
    sendSuccess(res, 200, 'Quiz result fetched successfully', result);
  }
);

export const getMyAttempts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    user: req.user!.id,
    status: { $in: ['submitted', 'auto_submitted'] },
  };

  const [attempts, total] = await Promise.all([
    QuizAttempt.find(filter)
      .populate('quiz', 'title slug difficulty durationMinutes passingPercentage')
      .populate('category', 'name slug color icon')
      .sort({ submittedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-answers')
      .lean(),
    QuizAttempt.countDocuments(filter),
  ]);

  sendSuccess(
    res,
    200,
    'Quiz history fetched successfully',
    { attempts },
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  );
});
