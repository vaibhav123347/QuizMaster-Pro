import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId format');

export const createQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Quiz title must be at least 3 characters')
    .max(120, 'Quiz title cannot exceed 120 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  category: objectIdSchema,
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  durationMinutes: z.coerce
    .number()
    .int('Duration must be a whole number of minutes')
    .min(1, 'Duration must be at least 1 minute')
    .max(180, 'Duration cannot exceed 180 minutes'),
  passingPercentage: z.coerce
    .number()
    .min(1, 'Passing percentage must be at least 1')
    .max(100, 'Passing percentage cannot exceed 100')
    .default(60),
  isActive: z.boolean().optional().default(true),
});

export const updateQuizSchema = createQuizSchema.partial();

export const toggleQuizStatusSchema = z.object({
  isActive: z.boolean(),
});

export const quizQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});
