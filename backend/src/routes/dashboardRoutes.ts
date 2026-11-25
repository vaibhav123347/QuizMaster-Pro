import { Router } from 'express';
import {
  getAdminDashboard,
  getStudentDashboard,
} from '../controllers/dashboardController';
import { authorize, protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/student', protect, authorize('student', 'admin'), getStudentDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

export default router;
