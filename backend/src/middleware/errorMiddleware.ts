import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.code, err.details);
  }

  if (err instanceof mongoose.Error.CastError) {
    return sendError(res, 400, `Invalid identifier format for ${err.path}`, 'INVALID_ID');
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(
      res,
      400,
      details[0]?.message || 'Database validation failed',
      'VALIDATION_ERROR',
      details
    );
  }

  const mongoErr = err as Error & { code?: number; keyValue?: Record<string, unknown> };
  if (mongoErr.code === 11000 && mongoErr.keyValue) {
    const field = Object.keys(mongoErr.keyValue)[0] || 'resource';
    return sendError(
      res,
      409,
      `A record with that ${field} already exists.`,
      'DUPLICATE_RESOURCE'
    );
  }

  if (env.nodeEnv !== 'production' && env.nodeEnv !== 'test') {
    console.error('[Unhandled Error]', err);
  }

  return sendError(
    res,
    500,
    'An unexpected internal server error occurred.',
    'INTERNAL_SERVER_ERROR'
  );
};
