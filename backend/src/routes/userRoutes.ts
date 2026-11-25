import { Router } from 'express';
import { z } from 'zod';
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUserStatus,
} from '../controllers/userController';
import { authorize, protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { objectIdSchema } from '../validators/quizValidator';
import { updateUserStatusSchema, userQuerySchema } from '../validators/userValidator';

const router = Router();

const idParamSchema = z.object({ id: objectIdSchema });

router.use(protect, authorize('admin'));

router.get('/', validate(userQuerySchema, 'query'), getUsers);
router.get('/:id', validate(idParamSchema, 'params'), getUserById);
router.patch(
  '/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateUserStatusSchema),
  updateUserStatus
);
router.delete('/:id', validate(idParamSchema, 'params'), deleteUser);

export default router;
