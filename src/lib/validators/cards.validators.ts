import { z } from 'zod';

export const createCardSchema = z.object({
    title: z.string().min(1,'Title is required').max(100,'Title must be less than 100 characters'),
    description: z.string().optional(),
    status: z.enum(['todo','doing','done']).default('todo')
});

export const updateCardSchema = z.object({
    title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
})

export const cardIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number)
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;