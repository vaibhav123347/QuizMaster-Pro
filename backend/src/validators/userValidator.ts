import { z } from 'zod';

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  role: z.enum(['student', 'admin']).optional(),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
