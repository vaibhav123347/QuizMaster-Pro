import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';
import { stripNoSqlOperators } from '../utils/sanitize';

type RequestSection = 'body' | 'query' | 'params';

export const sanitizeRequest = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = stripNoSqlOperators(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = stripNoSqlOperators(req.query) as Request['query'];
  }
  if (req.params && typeof req.params === 'object') {
    req.params = stripNoSqlOperators(req.params) as Request['params'];
  }
  next();
};

export const validate = (schema: ZodSchema, section: RequestSection = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[section]);
      if (section === 'body') {
        req.body = parsed;
      } else if (section === 'query') {
        req.query = parsed as Request['query'];
      } else {
        req.params = parsed as Request['params'];
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.errors.map((issue) => ({
          field: issue.path.join('.') || section,
          message: issue.message,
        }));
        return next(
          new AppError(
            formatted[0]?.message || 'Validation failed',
            400,
            'VALIDATION_ERROR',
            formatted
          )
        );
      }
      next(error);
    }
  };
};
