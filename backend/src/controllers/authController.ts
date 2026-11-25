import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const signToken = (userId: string, role: string): string => {
  if (!env.jwtSecret) {
    throw new AppError('JWT_SECRET is not configured on the server.', 500, 'SERVER_CONFIG_ERROR');
  }
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign({ sub: userId, role }, env.jwtSecret, options);
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, department } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      'An account with this email address already exists.',
      409,
      'DUPLICATE_EMAIL'
    );
  }

  // Always enforce student role on public registration
  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
    department: department || 'Computer Science & Engineering',
  });

  const token = signToken(user._id.toString(), user.role);

  sendSuccess(res, 201, 'Registration successful', {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      bio: user.bio,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError(
      'Your account has been deactivated. Contact an administrator.',
      403,
      'ACCOUNT_DISABLED'
    );
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id.toString(), user.role);

  sendSuccess(res, 200, 'Login successful', {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      bio: user.bio,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, 200, 'Logged out successfully', null);
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw new AppError('User account not found.', 404, 'USER_NOT_FOUND');
  }
  sendSuccess(res, 200, 'Profile fetched successfully', { user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, department, bio, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user!.id).select('+password');
  if (!user) {
    throw new AppError('User account not found.', 404, 'USER_NOT_FOUND');
  }

  if (name !== undefined) user.name = name;
  if (department !== undefined) user.department = department;
  if (bio !== undefined) user.bio = bio;

  if (newPassword) {
    const valid = await user.comparePassword(currentPassword || '');
    if (!valid) {
      throw new AppError(
        'Current password is incorrect.',
        400,
        'INCORRECT_CURRENT_PASSWORD'
      );
    }
    user.password = newPassword;
  }

  await user.save();

  sendSuccess(res, 200, 'Profile updated successfully', {
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      bio: user.bio,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
});
