import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../app';
import { env } from '../config/env';
import { Category } from '../models/Category';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';
import { User } from '../models/User';
import { runSeed } from '../scripts/seed';

let mongoServer: MongoMemoryServer;
let studentToken = '';
let secondStudentToken = '';
let adminToken = '';
let seededQuizId = '';
let attemptId = '';

beforeAll(async () => {
  env.jwtSecret = 'test_super_secure_jwt_secret_key_2026';
  env.adminEmail = 'admin@quizmaster.test';
  env.adminPassword = 'AdminPass123!';

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('QuizMaster Pro Backend API & Security Suite', () => {
  it('returns health status on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.database).toBe('connected');
  });

  it('seeds 9 categories, 9 quizzes, and 63 questions idempotently', async () => {
    await runSeed();
    const firstCounts = {
      categories: await Category.countDocuments(),
      quizzes: await Quiz.countDocuments(),
      questions: await Question.countDocuments(),
    };
    expect(firstCounts.categories).toBe(9);
    expect(firstCounts.quizzes).toBe(9);
    expect(firstCounts.questions).toBe(63);

    // Run seed a second time to verify idempotency
    await runSeed();
    expect(await Category.countDocuments()).toBe(9);
    expect(await Quiz.countDocuments()).toBe(9);
    expect(await Question.countDocuments()).toBe(63);

    const sampleQuiz = await Quiz.findOne();
    expect(sampleQuiz).not.toBeNull();
    seededQuizId = sampleQuiz!._id.toString();
  });

  it('registers students securely, prevents role escalation & duplicate emails', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice Cyber',
      email: 'alice@student.edu',
      password: 'Password123',
      role: 'admin', // Attempted privilege escalation must be ignored
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('student');
    expect(res.body.data.user.password).toBeUndefined();
    studentToken = res.body.data.token;

    // Duplicate email rejected
    const dupRes = await request(app).post('/api/auth/register').send({
      name: 'Alice Clone',
      email: 'alice@student.edu',
      password: 'Password123',
    });
    expect(dupRes.status).toBe(409);

    // Weak password rejected by Zod
    const weakRes = await request(app).post('/api/auth/register').send({
      name: 'Weak User',
      email: 'weak@student.edu',
      password: '123',
    });
    expect(weakRes.status).toBe(400);

    // Register second student for IDOR tests
    const secondRes = await request(app).post('/api/auth/register').send({
      name: 'Bob NetSec',
      email: 'bob@student.edu',
      password: 'Password123',
    });
    expect(secondRes.status).toBe(201);
    secondStudentToken = secondRes.body.data.token;
  });

  it('logs in seeded admin and rejects invalid credentials', async () => {
    const badLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@quizmaster.test',
      password: 'WrongPassword1',
    });
    expect(badLogin.status).toBe(401);

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@quizmaster.test',
      password: 'AdminPass123!',
    });
    expect(adminLogin.status).toBe(200);
    expect(adminLogin.body.data.user.role).toBe('admin');
    adminToken = adminLogin.body.data.token;
  });

  it('blocks students from accessing admin-only endpoints', async () => {
    const dashRes = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(dashRes.status).toBe(403);

    const questionsRes = await request(app)
      .get('/api/questions')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(questionsRes.status).toBe(403);

    const createCatRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Hackers',
        description: 'Unauthorized category creation',
      });
    expect(createCatRes.status).toBe(403);
  });

  it('prevents answer leaks before submission, grades server-side, and blocks duplicate submissions & IDOR', async () => {
    // Start quiz attempt
    const startRes = await request(app)
      .post(`/api/attempts/start/${seededQuizId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(startRes.status).toBe(201);
    attemptId = startRes.body.data.attempt._id;
    const questions = startRes.body.data.questions as Array<{
      _id: string;
      options: string[];
      correctOptionIndex?: number;
      explanation?: string;
    }>;
    expect(questions.length).toBeGreaterThan(0);

    // Ensure correctOptionIndex and explanation are NOT exposed
    for (const q of questions) {
      expect(q.correctOptionIndex).toBeUndefined();
      expect(q.explanation).toBeUndefined();
    }

    // Result endpoint must block access while attempt is in_progress
    const prematureResult = await request(app)
      .get(`/api/attempts/${attemptId}/result`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(prematureResult.status).toBe(403);

    // Second student must NOT be able to submit or read Student 1's attempt (IDOR check)
    const idorSubmit = await request(app)
      .post(`/api/attempts/${attemptId}/submit`)
      .set('Authorization', `Bearer ${secondStudentToken}`)
      .send({ answers: [] });
    expect(idorSubmit.status).toBe(403);

    // Fetch true answers from DB in test only to verify backend grading accuracy
    const dbQuestions = await Question.find({ quiz: seededQuizId })
      .select('+correctOptionIndex')
      .lean();
    const submittedAnswers = dbQuestions.map((q, index) => ({
      questionId: q._id.toString(),
      selectedOptionIndex: index === 0 ? q.correctOptionIndex : (q.correctOptionIndex + 1) % 4,
      markedForReview: index === 0,
    }));

    const submitRes = await request(app)
      .post(`/api/attempts/${attemptId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        answers: submittedAnswers,
        scoredMarks: 9999, // Tampered client field must be ignored
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.attempt.correctCount).toBe(1);
    expect(submitRes.body.data.attempt.wrongCount).toBe(dbQuestions.length - 1);
    expect(submitRes.body.data.review[0].explanation).toBeTruthy();

    // Duplicate submission must be rejected with 409
    const dupSubmit = await request(app)
      .post(`/api/attempts/${attemptId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ answers: submittedAnswers });
    expect(dupSubmit.status).toBe(409);
  });

  it('supports Admin CRUD for categories, quizzes, questions, and user status', async () => {
    // Create Category
    const catRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Cloud Security',
        description: 'AWS IAM, container hardening, and cloud security posture.',
        icon: 'Cloud',
        color: '#0ea5e9',
      });
    expect(catRes.status).toBe(201);
    const categoryId = catRes.body.data.category._id;

    // Create Quiz
    const quizRes = await request(app)
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Cloud Security Fundamentals',
        description: 'Assess IAM least privilege and cloud security best practices.',
        category: categoryId,
        difficulty: 'intermediate',
        durationMinutes: 15,
        passingPercentage: 60,
      });
    expect(quizRes.status).toBe(201);
    const quizId = quizRes.body.data.quiz._id;

    // Create Question
    const qRes = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        quiz: quizId,
        text: 'What does the Principle of Least Privilege state in IAM?',
        options: [
          'Grant administrator rights to all services',
          'Grant only the minimum permissions needed to perform a task',
          'Disable MFA for automated roles',
          'Share root API keys across teams',
        ],
        correctOptionIndex: 1,
        explanation: 'Least privilege minimizes blast radius by granting only required permissions.',
        difficulty: 'easy',
        marks: 2,
      });
    expect(qRes.status).toBe(201);
    const questionId = qRes.body.data.question._id;

    // Verify Quiz metadata synced
    const updatedQuizRes = await request(app)
      .get(`/api/quizzes/${quizId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(updatedQuizRes.body.data.quiz.questionCount).toBe(1);
    expect(updatedQuizRes.body.data.quiz.totalMarks).toBe(2);

    // Toggle quiz inactive
    const toggleRes = await request(app)
      .patch(`/api/quizzes/${quizId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });
    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.data.quiz.isActive).toBe(false);

    // Delete question, quiz, category
    expect(
      (
        await request(app)
          .delete(`/api/questions/${questionId}`)
          .set('Authorization', `Bearer ${adminToken}`)
      ).status
    ).toBe(200);
    expect(
      (
        await request(app)
          .delete(`/api/quizzes/${quizId}`)
          .set('Authorization', `Bearer ${adminToken}`)
      ).status
    ).toBe(200);
    expect(
      (
        await request(app)
          .delete(`/api/categories/${categoryId}`)
          .set('Authorization', `Bearer ${adminToken}`)
      ).status
    ).toBe(200);

    // Verify Admin Dashboard & Leaderboard
    const adminDash = await request(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminDash.status).toBe(200);
    expect(adminDash.body.data.stats.totalStudents).toBeGreaterThanOrEqual(2);
    expect(adminDash.body.data.stats.totalAttempts).toBeGreaterThanOrEqual(1);

    const leaderboard = await request(app)
      .get('/api/leaderboard')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(leaderboard.status).toBe(200);
    expect(leaderboard.body.data.leaderboard.length).toBeGreaterThanOrEqual(1);

    // Verify user list & status toggle
    const bob = await User.findOne({ email: 'bob@student.edu' });
    expect(bob).not.toBeNull();
    const toggleUser = await request(app)
      .patch(`/api/users/${bob!._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false });
    expect(toggleUser.status).toBe(200);
    expect(toggleUser.body.data.user.isActive).toBe(false);
  });
});
