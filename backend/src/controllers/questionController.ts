import { Request, Response } from 'express';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';
import { syncQuizMetadata } from '../services/quizStatsService';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { escapeRegex } from '../utils/sanitize';

export const getQuestionsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const quizId = typeof req.query.quizId === 'string' ? req.query.quizId : undefined;
  const categoryId =
    typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  const filter: Record<string, unknown> = {};
  if (quizId) filter.quiz = quizId;
  if (categoryId) filter.category = categoryId;
  if (search) {
    filter.text = new RegExp(escapeRegex(search), 'i');
  }

  const skip = (page - 1) * limit;
  const [questions, total] = await Promise.all([
    Question.find(filter)
      .select('+correctOptionIndex +explanation')
      .populate('quiz', 'title slug')
      .populate('category', 'name slug color')
      .sort({ quiz: 1, order: 1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Question.countDocuments(filter),
  ]);

  sendSuccess(
    res,
    200,
    'Questions fetched successfully',
    { questions },
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  );
});

export const getQuestionsByQuizAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate('category', 'name slug color');
    if (!quiz) {
      throw new AppError('Quiz not found.', 404, 'QUIZ_NOT_FOUND');
    }

    const questions = await Question.find({ quiz: quizId })
      .select('+correctOptionIndex +explanation')
      .sort({ order: 1, createdAt: 1 })
      .lean();

    sendSuccess(res, 200, 'Quiz questions fetched successfully', {
      quiz,
      questions,
    });
  }
);

export const getQuestionByIdAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = await Question.findById(id)
    .select('+correctOptionIndex +explanation')
    .populate('quiz', 'title')
    .populate('category', 'name');

  if (!question) {
    throw new AppError('Question not found.', 404, 'QUESTION_NOT_FOUND');
  }

  sendSuccess(res, 200, 'Question fetched successfully', { question });
});

export const createQuestion = asyncHandler(async (req: Request, res: Response) => {
  const {
    quiz: quizId,
    text,
    options,
    correctOptionIndex,
    explanation,
    difficulty,
    marks,
    order,
    isActive,
  } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new AppError('Referenced quiz does not exist.', 404, 'QUIZ_NOT_FOUND');
  }

  const existingDuplicate = await Question.findOne({ quiz: quizId, text });
  if (existingDuplicate) {
    throw new AppError(
      'This exact question already exists in the selected quiz.',
      409,
      'DUPLICATE_QUESTION'
    );
  }

  const nextOrder =
    order !== undefined
      ? order
      : (await Question.countDocuments({ quiz: quizId })) + 1;

  const question = await Question.create({
    quiz: quiz._id,
    category: quiz.category,
    text,
    options,
    correctOptionIndex,
    explanation,
    difficulty,
    marks,
    order: nextOrder,
    isActive,
  });

  await syncQuizMetadata(quiz._id);

  sendSuccess(res, 201, 'Question created successfully', { question });
});

export const updateQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = await Question.findById(id).select(
    '+correctOptionIndex +explanation'
  );
  if (!question) {
    throw new AppError('Question not found.', 404, 'QUESTION_NOT_FOUND');
  }

  const previousQuizId = question.quiz.toString();
  const {
    quiz: newQuizId,
    text,
    options,
    correctOptionIndex,
    explanation,
    difficulty,
    marks,
    order,
    isActive,
  } = req.body;

  if (newQuizId && newQuizId !== previousQuizId) {
    const newQuiz = await Quiz.findById(newQuizId);
    if (!newQuiz) {
      throw new AppError('Target quiz does not exist.', 404, 'QUIZ_NOT_FOUND');
    }
    question.quiz = newQuiz._id;
    question.category = newQuiz.category;
  }

  if (text !== undefined) question.text = text;
  if (options !== undefined) question.options = options;
  if (correctOptionIndex !== undefined)
    question.correctOptionIndex = correctOptionIndex;
  if (explanation !== undefined) question.explanation = explanation;
  if (difficulty !== undefined) question.difficulty = difficulty;
  if (marks !== undefined) question.marks = marks;
  if (order !== undefined) question.order = order;
  if (isActive !== undefined) question.isActive = isActive;

  await question.save();
  await syncQuizMetadata(question.quiz);
  if (newQuizId && newQuizId !== previousQuizId) {
    await syncQuizMetadata(previousQuizId);
  }

  sendSuccess(res, 200, 'Question updated successfully', { question });
});

export const deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const question = await Question.findById(id);
  if (!question) {
    throw new AppError('Question not found.', 404, 'QUESTION_NOT_FOUND');
  }

  const quizId = question.quiz;
  await question.deleteOne();
  await syncQuizMetadata(quizId);

  sendSuccess(res, 200, 'Question deleted successfully', null);
});
