import { Router } from 'express';
import { z } from 'zod';
import {
  createQuestion,
  deleteQuestion,
  getQuestionByIdAdmin,
  getQuestionsAdmin,
  getQuestionsByQuizAdmin,
  updateQuestion,
} from '../controllers/questionController';
import { authorize, protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import {
  createQuestionSchema,
  updateQuestionSchema,
} from '../validators/questionValidator';
import { objectIdSchema } from '../validators/quizValidator';

const router = Router();

const idParamSchema = z.object({ id: objectIdSchema });
const quizIdParamSchema = z.object({ quizId: objectIdSchema });

// All question management endpoints are strictly Admin-only to prevent answer leaks
router.use(protect, authorize('admin'));

router.get('/', getQuestionsAdmin);
router.get('/quiz/:quizId', validate(quizIdParamSchema, 'params'), getQuestionsByQuizAdmin);
router.get('/:id', validate(idParamSchema, 'params'), getQuestionByIdAdmin);
router.post('/', validate(createQuestionSchema), createQuestion);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateQuestionSchema),
  updateQuestion
);
router.delete('/:id', validate(idParamSchema, 'params'), deleteQuestion);

export default router;
