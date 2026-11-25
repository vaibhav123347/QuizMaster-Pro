import { Request, Response } from 'express';
import { QuizAttempt } from '../models/QuizAttempt';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { escapeRegex } from '../utils/sanitize';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const role = typeof req.query.role === 'string' ? req.query.role : undefined;

  const filter: Record<string, unknown> = {};
  if (role && ['student', 'admin'].includes(role)) {
    filter.role = role;
  }
  if (search) {
    const safeRegex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: safeRegex }, { email: safeRegex }, { department: safeRegex }];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const userIds = users.map((u) => u._id);
  const attemptSummaries = await QuizAttempt.aggregate<{
    _id: string;
    attempts: number;
    avgScore: number;
  }>([
    {
      $match: {
        user: { $in: userIds },
        status: { $in: ['submitted', 'auto_submitted'] },
      },
    },
    {
      $group: {
        _id: '$user',
        attempts: { $sum: 1 },
        avgScore: { $avg: '$percentage' },
      },
    },
  ]);

  const summaryMap = new Map(
    attemptSummaries.map((s) => [
      s._id.toString(),
      { attempts: s.attempts, avgScore: Math.round(s.avgScore * 10) / 10 },
    ])
  );

  const enrichedUsers = users.map((u) => {
    const stats = summaryMap.get(u._id.toString()) ?? { attempts: 0, avgScore: 0 };
    return { ...u, ...stats };
  });

  sendSuccess(
    res,
    200,
    'Users fetched successfully',
    { users: enrichedUsers },
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  );
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
  }
  sendSuccess(res, 200, 'User fetched successfully', { user });
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (id === req.user!.id) {
    throw new AppError(
      'You cannot deactivate your own administrator account.',
      400,
      'SELF_MODIFICATION_BLOCKED'
    );
  }

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!user) {
    throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
  }

  sendSuccess(
    res,
    200,
    `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
    { user }
  );
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === req.user!.id) {
    throw new AppError(
      'You cannot delete your own account.',
      400,
      'SELF_DELETION_BLOCKED'
    );
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
  }

  if (user.role === 'admin') {
    throw new AppError(
      'Cannot delete another administrator account.',
      403,
      'ADMIN_PROTECTION'
    );
  }

  await Promise.all([QuizAttempt.deleteMany({ user: id }), user.deleteOne()]);
  sendSuccess(res, 200, 'Student account and attempts deleted successfully', null);
});
