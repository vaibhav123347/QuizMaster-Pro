import {
  AdminDashboardData,
  AdminQuestion,
  ApiResponse,
  AttemptAnswerState,
  Category,
  LeaderboardEntry,
  Quiz,
  QuizAttemptSummary,
  QuizResultPayload,
  StartAttemptPayload,
  StudentDashboardData,
  User,
} from '../types';
import { apiClient } from './apiClient';

export const authService = {
  async register(payload: {
    name: string;
    email: string;
    password: string;
    department?: string;
  }) {
    const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
      '/auth/register',
      payload
    );
    return res.data.data;
  },

  async login(payload: { email: string; password: string }) {
    const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
      '/auth/login',
      payload
    );
    return res.data.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  async getMe() {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data.user;
  },

  async updateProfile(payload: {
    name?: string;
    department?: string;
    bio?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const res = await apiClient.put<ApiResponse<{ user: User }>>(
      '/auth/profile',
      payload
    );
    return res.data.data.user;
  },
};

export const categoryService = {
  async getAll(includeInactive = false) {
    const res = await apiClient.get<ApiResponse<{ categories: Category[] }>>(
      '/categories',
      { params: includeInactive ? { includeInactive: 'true' } : undefined }
    );
    return res.data.data.categories;
  },

  async create(payload: Partial<Category>) {
    const res = await apiClient.post<ApiResponse<{ category: Category }>>(
      '/categories',
      payload
    );
    return res.data.data.category;
  },

  async update(id: string, payload: Partial<Category>) {
    const res = await apiClient.put<ApiResponse<{ category: Category }>>(
      `/categories/${id}`,
      payload
    );
    return res.data.data.category;
  },

  async remove(id: string) {
    await apiClient.delete(`/categories/${id}`);
  },
};

export const quizService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
    includeInactive?: boolean;
  }) {
    const res = await apiClient.get<ApiResponse<{ quizzes: Quiz[] }>>('/quizzes', {
      params,
    });
    return { quizzes: res.data.data.quizzes, meta: res.data.meta };
  },

  async getById(id: string) {
    const res = await apiClient.get<ApiResponse<{ quiz: Quiz }>>(`/quizzes/${id}`);
    return res.data.data.quiz;
  },

  async create(payload: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    durationMinutes: number;
    passingPercentage: number;
    isActive: boolean;
  }) {
    const res = await apiClient.post<ApiResponse<{ quiz: Quiz }>>('/quizzes', payload);
    return res.data.data.quiz;
  },

  async update(
    id: string,
    payload: Partial<{
      title: string;
      description: string;
      category: string;
      difficulty: string;
      durationMinutes: number;
      passingPercentage: number;
      isActive: boolean;
    }>
  ) {
    const res = await apiClient.put<ApiResponse<{ quiz: Quiz }>>(
      `/quizzes/${id}`,
      payload
    );
    return res.data.data.quiz;
  },

  async toggleStatus(id: string, isActive: boolean) {
    const res = await apiClient.patch<ApiResponse<{ quiz: Quiz }>>(
      `/quizzes/${id}/status`,
      { isActive }
    );
    return res.data.data.quiz;
  },

  async remove(id: string) {
    await apiClient.delete(`/quizzes/${id}`);
  },
};

export const questionService = {
  async getAllAdmin(params?: {
    page?: number;
    limit?: number;
    quizId?: string;
    categoryId?: string;
    search?: string;
  }) {
    const res = await apiClient.get<ApiResponse<{ questions: AdminQuestion[] }>>(
      '/questions',
      { params }
    );
    return { questions: res.data.data.questions, meta: res.data.meta };
  },

  async getByQuizAdmin(quizId: string) {
    const res = await apiClient.get<
      ApiResponse<{ quiz: Quiz; questions: AdminQuestion[] }>
    >(`/questions/quiz/${quizId}`);
    return res.data.data;
  },

  async getByIdAdmin(id: string) {
    const res = await apiClient.get<ApiResponse<{ question: AdminQuestion }>>(
      `/questions/${id}`
    );
    return res.data.data.question;
  },

  async create(payload: {
    quiz: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
    difficulty: string;
    marks: number;
    isActive?: boolean;
  }) {
    const res = await apiClient.post<ApiResponse<{ question: AdminQuestion }>>(
      '/questions',
      payload
    );
    return res.data.data.question;
  },

  async update(
    id: string,
    payload: Partial<{
      quiz: string;
      text: string;
      options: string[];
      correctOptionIndex: number;
      explanation: string;
      difficulty: string;
      marks: number;
      isActive: boolean;
    }>
  ) {
    const res = await apiClient.put<ApiResponse<{ question: AdminQuestion }>>(
      `/questions/${id}`,
      payload
    );
    return res.data.data.question;
  },

  async remove(id: string) {
    await apiClient.delete(`/questions/${id}`);
  },
};

export const attemptService = {
  async start(quizId: string) {
    const res = await apiClient.post<ApiResponse<StartAttemptPayload>>(
      `/attempts/start/${quizId}`
    );
    return res.data.data;
  },

  async saveProgress(attemptId: string, answers: AttemptAnswerState[]) {
    await apiClient.patch(`/attempts/${attemptId}/progress`, { answers });
  },

  async submit(
    attemptId: string,
    answers: AttemptAnswerState[],
    autoSubmitted = false
  ) {
    const res = await apiClient.post<ApiResponse<QuizResultPayload>>(
      `/attempts/${attemptId}/submit`,
      { answers, autoSubmitted }
    );
    return res.data.data;
  },

  async getResult(attemptId: string) {
    const res = await apiClient.get<ApiResponse<QuizResultPayload>>(
      `/attempts/${attemptId}/result`
    );
    return res.data.data;
  },

  async getMyHistory(page = 1, limit = 10) {
    const res = await apiClient.get<ApiResponse<{ attempts: QuizAttemptSummary[] }>>(
      '/attempts/my',
      { params: { page, limit } }
    );
    return { attempts: res.data.data.attempts, meta: res.data.meta };
  },
};

export const dashboardService = {
  async getStudentDashboard() {
    const res = await apiClient.get<ApiResponse<StudentDashboardData>>(
      '/dashboard/student'
    );
    return res.data.data;
  },

  async getAdminDashboard() {
    const res = await apiClient.get<ApiResponse<AdminDashboardData>>(
      '/dashboard/admin'
    );
    return res.data.data;
  },

  async getLeaderboard(params?: { quizId?: string; categoryId?: string; limit?: number }) {
    const res = await apiClient.get<ApiResponse<{ leaderboard: LeaderboardEntry[] }>>(
      '/leaderboard',
      { params }
    );
    return res.data.data.leaderboard;
  },
};

export const userService = {
  async getAll(params?: { page?: number; limit?: number; search?: string; role?: string }) {
    const res = await apiClient.get<ApiResponse<{ users: User[] }>>('/users', {
      params,
    });
    return { users: res.data.data.users, meta: res.data.meta };
  },

  async updateStatus(id: string, isActive: boolean) {
    const res = await apiClient.patch<ApiResponse<{ user: User }>>(
      `/users/${id}/status`,
      { isActive }
    );
    return res.data.data.user;
  },

  async remove(id: string) {
    await apiClient.delete(`/users/${id}`);
  },
};
