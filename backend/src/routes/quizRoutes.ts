import { Router } from 'express';
import { z } from 'zod';
import {
  createQuiz,
  deleteQuiz,
  getQuizById,
  getQuizzes,
  toggleQuizStatus,
  updateQuiz,
} from '../controllers/quizController';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import {
  createQuizSchema,
  objectIdSchema,
  quizQuerySchema,
  toggleQuizStatusSchema,
  updateQuizSchema,
} from '../validators/quizValidator';

const router = Router();

const idParamSchema = z.object({ id: objectIdSchema });

router.get('/', optionalAuth, validate(quizQuerySchema, 'query'), getQuizzes);
router.get('/:id', optionalAuth, getQuizById);
router.post('/', protect, authorize('admin'), validate(createQuizSchema), createQuiz);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  validate(updateQuizSchema),
  updateQuiz
);
router.patch(
  '/:id/status',
  protect,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  validate(toggleQuizStatusSchema),
  toggleQuizStatus
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  deleteQuiz
);

export default router;
