import { Router } from 'express';
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateProfile,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimitMiddleware';
import { validate } from '../middleware/validateMiddleware';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from '../validators/authValidator';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

export default router;
