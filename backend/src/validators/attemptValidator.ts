import { z } from 'zod';
import { objectIdSchema } from './quizValidator';

const answerEntrySchema = z.object({
  questionId: objectIdSchema,
  selectedOptionIndex: z.number().int().min(0).max(3).nullable(),
  markedForReview: z.boolean().optional().default(false),
});

export const saveAttemptProgressSchema = z.object({
  answers: z.array(answerEntrySchema).max(200),
});

export const submitAttemptSchema = z.object({
  answers: z.array(answerEntrySchema).max(200),
  autoSubmitted: z.boolean().optional().default(false),
});
