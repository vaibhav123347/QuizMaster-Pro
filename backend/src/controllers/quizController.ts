import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';
import { QuizAttempt } from '../models/QuizAttempt';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { escapeRegex, toSlug } from '../utils/sanitize';

export const getQuizzes = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const categoryParam =
    typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const difficulty =
    typeof req.query.difficulty === 'string' ? req.query.difficulty : undefined;
  const includeInactive =
    req.user?.role === 'admin' && String(req.query.includeInactive) === 'true';

  const filter: Record<string, unknown> = {};
  if (!includeInactive) {
    filter.isActive = true;
  }

  if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
    filter.difficulty = difficulty;
  }

  if (categoryParam) {
    if (mongoose.Types.ObjectId.isValid(categoryParam)) {
      filter.category = new mongoose.Types.ObjectId(categoryParam);
    } else {
      const cat = await Category.findOne({ slug: categoryParam.toLowerCase() });
      if (!cat) {
        return sendSuccess(
          res,
          200,
          'Quizzes fetched successfully',
          { quizzes: [] },
          { page, limit, total: 0, totalPages: 0 }
        );
      }
      filter.category = cat._id;
    }
  }

  if (search) {
    const safeRegex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: safeRegex }, { description: safeRegex }];
  }

  const skip = (page - 1) * limit;

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .populate('category', 'name slug color icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Quiz.countDocuments(filter),
  ]);

  sendSuccess(
    res,
    200,
    'Quizzes fetched successfully',
    { quizzes },
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  );
});

export const getQuizById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const quiz = await Quiz.findOne(isObjectId ? { _id: id } : { slug: id }).populate(
    'category',
    'name slug color icon'
  );

  if (!quiz) {
    throw new AppError('Quiz not found.', 404, 'QUIZ_NOT_FOUND');
  }

  if (!quiz.isActive && req.user?.role !== 'admin') {
    throw new AppError('Quiz is not currently available.', 404, 'QUIZ_NOT_FOUND');
  }

  sendSuccess(res, 200, 'Quiz details fetched successfully', { quiz });
});

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    difficulty,
    durationMinutes,
    passingPercentage,
    isActive,
  } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new AppError('Selected category does not exist.', 404, 'CATEGORY_NOT_FOUND');
  }

  let slug = toSlug(title);
  const existingSlug = await Quiz.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const quiz = await Quiz.create({
    title,
    slug,
    description,
    category,
    difficulty,
    durationMinutes,
    passingPercentage,
    isActive,
    createdBy: req.user?.id,
  });

  const populated = await quiz.populate('category', 'name slug color icon');
  sendSuccess(res, 201, 'Quiz created successfully', { quiz: populated });
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new AppError('Quiz not found.', 404, 'QUIZ_NOT_FOUND');
  }

  const {
    title,
    description,
    category,
    difficulty,
    durationMinutes,
    passingPercentage,
    isActive,
  } = req.body;

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new AppError('Selected category does not exist.', 404, 'CATEGORY_NOT_FOUND');
    }
    quiz.category = category;
    await Question.updateMany({ quiz: quiz._id }, { $set: { category } });
  }

  if (title && title !== quiz.title) {
    quiz.title = title;
    const candidateSlug = toSlug(title);
    const conflict = await Quiz.findOne({ _id: { $ne: id }, slug: candidateSlug });
    quiz.slug = conflict ? `${candidateSlug}-${Date.now().toString().slice(-4)}` : candidateSlug;
  }

  if (description !== undefined) quiz.description = description;
  if (difficulty !== undefined) quiz.difficulty = difficulty;
  if (durationMinutes !== undefined) quiz.durationMinutes = durationMinutes;
  if (passingPercentage !== undefined) quiz.passingPercentage = passingPercentage;
  if (isActive !== undefined) quiz.isActive = isActive;

  await quiz.save();
  const populated = await quiz.populate('category', 'name slug color icon');
  sendSuccess(res, 200, 'Quiz updated successfully', { quiz: populated });
});

export const toggleQuizStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const quiz = await Quiz.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  ).populate('category', 'name slug color icon');

  if (!quiz) {
    throw new AppError('Quiz not found.', 404, 'QUIZ_NOT_FOUND');
  }

  sendSuccess(
    res,
    200,
    `Quiz ${isActive ? 'activated' : 'deactivated'} successfully`,
    { quiz }
  );
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new AppError('Quiz not found.', 404, 'QUIZ_NOT_FOUND');
  }

  await Promise.all([
    Question.deleteMany({ quiz: id }),
    QuizAttempt.deleteMany({ quiz: id }),
    quiz.deleteOne(),
  ]);

  sendSuccess(res, 200, 'Quiz and associated questions deleted successfully', null);
});
