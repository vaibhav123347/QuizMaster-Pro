import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrls: string[];
  adminEmail: string;
  adminPassword: string;
}

const parseClientUrls = (raw?: string): string[] => {
  if (!raw) {
    return ['http://localhost:5173', 'http://127.0.0.1:5173'];
  }
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env: EnvConfig = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'quizmaster-local-development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: parseClientUrls(process.env.CLIENT_URL),
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
};

export const validateRuntimeEnv = (): void => {
  if (!env.jwtSecret || env.jwtSecret.length < 16) {
    throw new Error(
      'JWT_SECRET is missing or too short (minimum 16 characters required) in backend/.env.'
    );
  }
};
