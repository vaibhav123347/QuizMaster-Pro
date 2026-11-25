import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse';

const DB_STATES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export const healthCheck = (_req: Request, res: Response): void => {
  const readyState = mongoose.connection.readyState;
  sendSuccess(res, 200, 'QuizMaster Pro API is operational', {
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    database: DB_STATES[readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
};
