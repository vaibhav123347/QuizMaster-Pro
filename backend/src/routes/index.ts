import { Router } from 'express';
import attemptRoutes from './attemptRoutes';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';
import dashboardRoutes from './dashboardRoutes';
import healthRoutes from './healthRoutes';
import leaderboardRoutes from './leaderboardRoutes';
import questionRoutes from './questionRoutes';
import quizRoutes from './quizRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/quizzes', quizRoutes);
router.use('/questions', questionRoutes);
router.use('/attempts', attemptRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

export default router;
