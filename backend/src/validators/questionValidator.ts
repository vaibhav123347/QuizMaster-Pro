import { z } from 'zod';
import { objectIdSchema } from './quizValidator';

export const createQuestionSchema = z.object({
  quiz: objectIdSchema,
  category: objectIdSchema.optional(),
  text: z
    .string()
    .trim()
    .min(5, 'Question text must be at least 5 characters')
    .max(1000, 'Question text cannot exceed 1000 characters'),
  options: z
    .array(z.string().trim().min(1, 'Option cannot be empty').max(300))
    .length(4, 'Exactly 4 answer options are required'),
  correctOptionIndex: z.coerce
    .number()
    .int()
    .min(0, 'Correct option index must be between 0 and 3')
    .max(3, 'Correct option index must be between 0 and 3'),
  explanation: z
    .string()
    .trim()
    .min(5, 'Explanation must be at least 5 characters')
    .max(1500, 'Explanation cannot exceed 1500 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  marks: z.coerce.number().int().min(1).max(20).default(1),
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateQuestionSchema = createQuestionSchema.partial();
