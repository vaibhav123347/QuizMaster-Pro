export type UserRole = 'student' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  bio?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  attempts?: number;
  avgScore?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  quizCount?: number;
}

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Quiz {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  difficulty: QuizDifficulty;
  durationMinutes: number;
  passingPercentage: number;
  totalMarks: number;
  questionCount: number;
  isActive: boolean;
  createdAt: string;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface StudentQuestion {
  _id: string;
  text: string;
  options: string[];
  difficulty: QuestionDifficulty;
  marks: number;
  order: number;
}

export interface AdminQuestion extends StudentQuestion {
  quiz: string | { _id: string; title: string; slug: string };
  category: string | { _id: string; name: string; slug: string; color: string };
  correctOptionIndex: number;
  explanation: string;
  isActive: boolean;
}

export interface AttemptAnswerState {
  questionId: string;
  selectedOptionIndex: number | null;
  markedForReview: boolean;
}

export interface StartAttemptPayload {
  attempt: {
    _id: string;
    status: 'in_progress' | 'submitted' | 'auto_submitted';
    startedAt: string;
    expiresAt: string;
    remainingSeconds: number;
    totalMarks: number;
    answers: AttemptAnswerState[];
  };
  quiz: {
    _id: string;
    title: string;
    description: string;
    difficulty: QuizDifficulty;
    durationMinutes: number;
    passingPercentage: number;
    totalMarks: number;
    questionCount: number;
    category: Category;
  };
  questions: StudentQuestion[];
  resumed: boolean;
}

export interface AttemptReviewItem {
  questionNumber: number;
  questionId: string;
  text: string;
  options: string[];
  difficulty: QuestionDifficulty;
  marks: number;
  selectedOptionIndex: number | null;
  correctOptionIndex: number | null;
  explanation: string;
  isCorrect: boolean;
  marksAwarded: number;
  markedForReview: boolean;
}

export interface QuizAttemptSummary {
  _id: string;
  status: 'in_progress' | 'submitted' | 'auto_submitted';
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number;
  totalMarks: number;
  scoredMarks: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  passed: boolean;
  user?: User;
  quiz: {
    _id: string;
    title: string;
    slug?: string;
    difficulty: QuizDifficulty;
    durationMinutes?: number;
    passingPercentage?: number;
  };
  category: {
    _id: string;
    name: string;
    slug?: string;
    color: string;
    icon?: string;
  };
}

export interface QuizResultPayload {
  attempt: QuizAttemptSummary;
  review: AttemptReviewItem[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  department?: string;
  attemptsCount: number;
  passedCount: number;
  avgPercentage: number;
  bestPercentage: number;
  totalScoredMarks: number;
  avgTimeSeconds: number;
  lastAttemptAt: string;
}

export interface StudentDashboardData {
  stats: {
    totalAttempts: number;
    passedCount: number;
    averageScore: number;
    bestScore: number;
    availableQuizzesCount: number;
    categoriesCount: number;
  };
  recentAttempts: QuizAttemptSummary[];
  categoryPerformance: Array<{
    categoryName: string;
    color: string;
    avgScore: number;
    attempts: number;
  }>;
  scoreTrend: Array<{
    quiz: string;
    score: number;
  }>;
  recommendedQuizzes: Quiz[];
}

export interface AdminDashboardData {
  stats: {
    totalStudents: number;
    activeStudents: number;
    totalQuizzes: number;
    activeQuizzes: number;
    totalCategories: number;
    totalAttempts: number;
    averagePerformance: number;
    passRate: number;
    autoSubmittedCount: number;
  };
  recentAttempts: QuizAttemptSummary[];
  popularQuizzes: Array<{
    quizId: string;
    title: string;
    difficulty: QuizDifficulty;
    attempts: number;
    avgScore: number;
    passRate: number;
  }>;
  categoryAnalytics: Array<{
    name: string;
    color: string;
    attempts: number;
    avgScore: number;
  }>;
  dailyAttemptsTrend: Array<{
    date: string;
    attempts: number;
    avgScore: number;
  }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}
