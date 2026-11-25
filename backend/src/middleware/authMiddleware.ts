import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, UserRole } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const extractBearerToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  return token || null;
};

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractBearerToken(req);
    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED');
    }

    if (!env.jwtSecret) {
      throw new AppError('Authentication configuration error.', 500, 'SERVER_CONFIG_ERROR');
    }

    let decoded: AuthTokenPayload;
    try {
      decoded = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new AppError('Session expired. Please log in again.', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN');
    }

    const user = await User.findById(decoded.sub).select('name email role isActive');
    if (!user) {
      throw new AppError('Account no longer exists.', 401, 'USER_NOT_FOUND');
    }
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Contact administrator.', 403, 'ACCOUNT_DISABLED');
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  }
);

export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractBearerToken(req);
    if (!token || !env.jwtSecret) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
      const user = await User.findById(decoded.sub).select('name email role isActive');
      if (user && user.isActive) {
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    } catch {
      // Ignore invalid token on optional routes
    }

    next();
  }
);

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'UNAUTHORIZED'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          'Access denied. You do not have permission to perform this action.',
          403,
          'FORBIDDEN'
        )
      );
    }
    next();
  };
};
