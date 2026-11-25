import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: PaginationMeta
): Response => {
  const payload: {
    success: true;
    message: string;
    data: T;
    meta?: PaginationMeta;
  } = {
    success: true,
    message,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  code = 'ERROR',
  details?: unknown
): Response => {
  const payload: {
    success: false;
    message: string;
    code: string;
    details?: unknown;
  } = {
    success: false,
    message,
    code,
  };

  if (details !== undefined) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
};
