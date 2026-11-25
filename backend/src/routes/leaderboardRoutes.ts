import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getLeaderboard);

export default router;
