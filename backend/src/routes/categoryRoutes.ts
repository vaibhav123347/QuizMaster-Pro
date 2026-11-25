import { Router } from 'express';
import { z } from 'zod';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/categoryValidator';
import { objectIdSchema } from '../validators/quizValidator';

const router = Router();

const idParamSchema = z.object({ id: objectIdSchema });

router.get('/', optionalAuth, getCategories);
router.get('/:id', optionalAuth, getCategoryById);
router.post('/', protect, authorize('admin'), validate(createCategorySchema), createCategory);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  validate(updateCategorySchema),
  updateCategory
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  deleteCategory
);

export default router;
