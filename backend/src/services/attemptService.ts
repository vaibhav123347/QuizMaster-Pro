import mongoose from 'mongoose';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';
import { IAttemptAnswer, IQuizAttempt, QuizAttempt } from '../models/QuizAttempt';
import { UserRole } from '../models/User';
import { AppError } from '../utils/AppError';

export interface SubmittedAnswerInput {
  questionId: string;
  selectedOptionIndex: number | null;
  markedForReview?: boolean;
}

const sanitizeQuestionForStudent = (q: {
  _id: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  difficulty: string;
  marks: number;
  order: number;
}) => ({
  _id: q._id.toString(),
  text: q.text,
  options: q.options,
  difficulty: q.difficulty,
  marks: q.marks,
  order: q.order,
});

const finalizeAttemptGrades = async (
  attempt: IQuizAttempt,
  incomingAnswers: SubmittedAnswerInput[] | null,
  status: 'submitted' | 'auto_submitted'
): Promise<IQuizAttempt> => {
  const quiz = await Quiz.findById(attempt.quiz);
  if (!quiz) {
    throw new AppError('Associated quiz no longer exists.', 404, 'QUIZ_NOT_FOUND');
  }

  const questionIds = attempt.answers.map((a) => a.question);
  const questions = await Question.find({ _id: { $in: questionIds } }).select(
    '+correctOptionIndex +explanation'
  );

  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  const incomingMap = new Map<string, SubmittedAnswerInput>();
  if (incomingAnswers) {
    for (const item of incomingAnswers) {
      incomingMap.set(item.questionId, item);
    }
  }

  let totalMarks = 0;
  let scoredMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  const gradedAnswers: IAttemptAnswer[] = attempt.answers.map((existing) => {
    const qId = existing.question.toString();
    const questionDoc = questionMap.get(qId);
    const incoming = incomingMap.get(qId);

    const selectedOptionIndex =
      incoming !== undefined ? incoming.selectedOptionIndex : existing.selectedOptionIndex;
    const markedForReview =
      incoming?.markedForReview !== undefined
        ? incoming.markedForReview
        : existing.markedForReview;

    if (!questionDoc) {
      unansweredCount += 1;
      return {
        question: existing.question,
        selectedOptionIndex: null,
        isCorrect: false,
        marksAwarded: 0,
        markedForReview,
      };
    }

    totalMarks += questionDoc.marks;

    if (selectedOptionIndex === null || selectedOptionIndex === undefined) {
      unansweredCount += 1;
      return {
        question: existing.question,
        selectedOptionIndex: null,
        isCorrect: false,
        marksAwarded: 0,
        markedForReview,
      };
    }

    const isCorrect = selectedOptionIndex === questionDoc.correctOptionIndex;
    const marksAwarded = isCorrect ? questionDoc.marks : 0;

    if (isCorrect) {
      correctCount += 1;
      scoredMarks += marksAwarded;
    } else {
      wrongCount += 1;
    }

    return {
      question: existing.question,
      selectedOptionIndex,
      isCorrect,
      marksAwarded,
      markedForReview,
    };
  });

  const percentage =
    totalMarks > 0 ? Math.round((scoredMarks / totalMarks) * 10000) / 100 : 0;
  const passed = percentage >= quiz.passingPercentage;

  const submittedAt = new Date();
  const maxDurationSeconds = quiz.durationMinutes * 60;
  const elapsedSeconds = Math.max(
    1,
    Math.round((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)
  );
  const timeTakenSeconds = Math.min(maxDurationSeconds, elapsedSeconds);

  const updated = await QuizAttempt.findOneAndUpdate(
    {
      _id: attempt._id,
      user: attempt.user,
      status: 'in_progress',
    },
    {
      $set: {
        status,
        submittedAt,
        timeTakenSeconds,
        answers: gradedAnswers,
        totalMarks,
        scoredMarks,
        percentage,
        correctCount,
        wrongCount,
        unansweredCount,
        passed,
      },
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError(
      'This quiz attempt has already been submitted.',
      409,
      'DUPLICATE_SUBMISSION'
    );
  }

  return updated;
};

export const startOrResumeAttempt = async (userId: string, quizId: string) => {
  const quiz = await Quiz.findById(quizId).populate('category', 'name slug color icon');
  if (!quiz || !quiz.isActive) {
    throw new AppError('Quiz not found or currently inactive.', 404, 'QUIZ_NOT_FOUND');
  }

  const questions = await Question.find({ quiz: quiz._id, isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .select('text options difficulty marks order');

  if (questions.length === 0) {
    throw new AppError(
      'This quiz has no active questions yet.',
      400,
      'QUIZ_HAS_NO_QUESTIONS'
    );
  }

  const existingInProgress = await QuizAttempt.findOne({
    user: userId,
    quiz: quiz._id,
    status: 'in_progress',
  });

  const now = new Date();

  if (existingInProgress) {
    if (now < existingInProgress.expiresAt) {
      const remainingSeconds = Math.max(
        1,
        Math.floor((existingInProgress.expiresAt.getTime() - now.getTime()) / 1000)
      );

      const attemptQuestionsMap = new Map(questions.map((q) => [q._id.toString(), q]));
      const orderedQuestions = existingInProgress.answers
        .map((ans) => attemptQuestionsMap.get(ans.question.toString()))
        .filter((q): q is NonNullable<typeof q> => Boolean(q))
        .map(sanitizeQuestionForStudent);

      return {
        attempt: {
          _id: existingInProgress._id.toString(),
          status: existingInProgress.status,
          startedAt: existingInProgress.startedAt,
          expiresAt: existingInProgress.expiresAt,
          remainingSeconds,
          totalMarks: existingInProgress.totalMarks,
          answers: existingInProgress.answers.map((a) => ({
            questionId: a.question.toString(),
            selectedOptionIndex: a.selectedOptionIndex,
            markedForReview: a.markedForReview,
          })),
        },
        quiz: {
          _id: quiz._id.toString(),
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty,
          durationMinutes: quiz.durationMinutes,
          passingPercentage: quiz.passingPercentage,
          totalMarks: quiz.totalMarks,
          questionCount: orderedQuestions.length,
          category: quiz.category,
        },
        questions: orderedQuestions,
        resumed: true,
      };
    }

    // Expired in-progress attempt: auto-grade it before creating a fresh attempt
    await finalizeAttemptGrades(existingInProgress, null, 'auto_submitted');
  }

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + quiz.durationMinutes * 60 * 1000);
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  const initialAnswers: IAttemptAnswer[] = questions.map((q) => ({
    question: q._id,
    selectedOptionIndex: null,
    isCorrect: false,
    marksAwarded: 0,
    markedForReview: false,
  }));

  const attempt = await QuizAttempt.create({
    user: userId,
    quiz: quiz._id,
    category: quiz.category._id ?? quiz.category,
    status: 'in_progress',
    startedAt,
    expiresAt,
    totalMarks,
    answers: initialAnswers,
  });

  return {
    attempt: {
      _id: attempt._id.toString(),
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      remainingSeconds: quiz.durationMinutes * 60,
      totalMarks,
      answers: initialAnswers.map((a) => ({
        questionId: a.question.toString(),
        selectedOptionIndex: a.selectedOptionIndex,
        markedForReview: a.markedForReview,
      })),
    },
    quiz: {
      _id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      passingPercentage: quiz.passingPercentage,
      totalMarks,
      questionCount: questions.length,
      category: quiz.category,
    },
    questions: questions.map(sanitizeQuestionForStudent),
    resumed: false,
  };
};

export const saveAttemptProgress = async (
  attemptId: string,
  userId: string,
  answers: SubmittedAnswerInput[]
) => {
  const attempt = await QuizAttempt.findById(attemptId);
  if (!attempt) {
    throw new AppError('Quiz attempt not found.', 404, 'ATTEMPT_NOT_FOUND');
  }
  if (attempt.user.toString() !== userId) {
    throw new AppError(
      'You are not authorized to modify this quiz attempt.',
      403,
      'FORBIDDEN_ATTEMPT_ACCESS'
    );
  }
  if (attempt.status !== 'in_progress') {
    throw new AppError(
      'Cannot update progress of an already submitted attempt.',
      409,
      'ALREADY_SUBMITTED'
    );
  }
  if (new Date() > attempt.expiresAt) {
    throw new AppError(
      'Quiz time has expired. Submitting attempt.',
      409,
      'ATTEMPT_EXPIRED'
    );
  }

  const incomingMap = new Map(answers.map((a) => [a.questionId, a]));

  attempt.answers = attempt.answers.map((existing) => {
    const incoming = incomingMap.get(existing.question.toString());
    if (!incoming) {
      return existing;
    }
    return {
      question: existing.question,
      selectedOptionIndex: incoming.selectedOptionIndex,
      isCorrect: false,
      marksAwarded: 0,
      markedForReview: Boolean(incoming.markedForReview),
    };
  });

  await attempt.save();

  return {
    attemptId: attempt._id.toString(),
    savedAt: new Date(),
  };
};

export const submitQuizAttempt = async (
  attemptId: string,
  userId: string,
  answers: SubmittedAnswerInput[],
  autoSubmitted = false
) => {
  const attempt = await QuizAttempt.findById(attemptId);
  if (!attempt) {
    throw new AppError('Quiz attempt not found.', 404, 'ATTEMPT_NOT_FOUND');
  }
  if (attempt.user.toString() !== userId) {
    throw new AppError(
      'You are not authorized to submit this quiz attempt.',
      403,
      'FORBIDDEN_ATTEMPT_ACCESS'
    );
  }
  if (attempt.status !== 'in_progress') {
    throw new AppError(
      'Duplicate submission blocked. This quiz attempt was already submitted.',
      409,
      'DUPLICATE_SUBMISSION'
    );
  }

  const now = new Date();
  const isExpired = now.getTime() > attempt.expiresAt.getTime();
  const finalStatus = autoSubmitted || isExpired ? 'auto_submitted' : 'submitted';

  const finalized = await finalizeAttemptGrades(attempt, answers, finalStatus);
  return getAttemptResult(finalized._id.toString(), userId, 'student');
};

export const getAttemptResult = async (
  attemptId: string,
  requesterId: string,
  requesterRole: UserRole
) => {
  const attempt = await QuizAttempt.findById(attemptId)
    .populate('user', 'name email department')
    .populate('quiz', 'title slug description difficulty durationMinutes passingPercentage')
    .populate('category', 'name slug color icon');

  if (!attempt) {
    throw new AppError('Quiz attempt not found.', 404, 'ATTEMPT_NOT_FOUND');
  }

  const attemptOwnerId =
    (attempt.user as unknown as { _id: mongoose.Types.ObjectId })._id?.toString() ??
    attempt.user.toString();

  if (requesterRole !== 'admin' && attemptOwnerId !== requesterId) {
    throw new AppError(
      'You do not have permission to view this quiz result.',
      403,
      'FORBIDDEN_RESULT_ACCESS'
    );
  }

  if (attempt.status === 'in_progress') {
    throw new AppError(
      'Results and correct answers are locked until the quiz is submitted.',
      403,
      'ATTEMPT_IN_PROGRESS'
    );
  }

  const questionIds = attempt.answers.map((a) => a.question);
  const questions = await Question.find({ _id: { $in: questionIds } }).select(
    '+correctOptionIndex +explanation'
  );
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

  const detailedReview = attempt.answers.map((ans, index) => {
    const q = questionMap.get(ans.question.toString());
    return {
      questionNumber: index + 1,
      questionId: ans.question.toString(),
      text: q?.text ?? 'Question removed',
      options: q?.options ?? [],
      difficulty: q?.difficulty ?? 'medium',
      marks: q?.marks ?? 0,
      selectedOptionIndex: ans.selectedOptionIndex,
      correctOptionIndex: q?.correctOptionIndex ?? null,
      explanation: q?.explanation ?? '',
      isCorrect: ans.isCorrect,
      marksAwarded: ans.marksAwarded,
      markedForReview: ans.markedForReview,
    };
  });

  return {
    attempt: {
      _id: attempt._id.toString(),
      status: attempt.status,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      timeTakenSeconds: attempt.timeTakenSeconds,
      totalMarks: attempt.totalMarks,
      scoredMarks: attempt.scoredMarks,
      percentage: attempt.percentage,
      correctCount: attempt.correctCount,
      wrongCount: attempt.wrongCount,
      unansweredCount: attempt.unansweredCount,
      passed: attempt.passed,
      user: attempt.user,
      quiz: attempt.quiz,
      category: attempt.category,
    },
    review: detailedReview,
  };
};
