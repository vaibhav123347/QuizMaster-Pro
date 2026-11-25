import { Router } from 'express';
import { z } from 'zod';
import {
  getMyAttempts,
  getResultByAttemptId,
  saveProgress,
  startAttempt,
  submitAttempt,
} from '../controllers/attemptController';
import { authorize, protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import {
  saveAttemptProgressSchema,
  submitAttemptSchema,
} from '../validators/attemptValidator';
import { objectIdSchema } from '../validators/quizValidator';

const router = Router();

const quizIdParam = z.object({ quizId: objectIdSchema });
const attemptIdParam = z.object({ attemptId: objectIdSchema });

router.use(protect);

router.get('/my', authorize('student', 'admin'), getMyAttempts);
router.post(
  '/start/:quizId',
  authorize('student', 'admin'),
  validate(quizIdParam, 'params'),
  startAttempt
);
router.patch(
  '/:attemptId/progress',
  authorize('student', 'admin'),
  validate(attemptIdParam, 'params'),
  validate(saveAttemptProgressSchema),
  saveProgress
);
router.post(
  '/:attemptId/submit',
  authorize('student', 'admin'),
  validate(attemptIdParam, 'params'),
  validate(submitAttemptSchema),
  submitAttempt
);
router.get(
  '/:attemptId/result',
  authorize('student', 'admin'),
  validate(attemptIdParam, 'params'),
  getResultByAttemptId
);

export default router;
