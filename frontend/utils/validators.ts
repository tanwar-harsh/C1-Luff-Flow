import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
    errorMap: () => ({ message: 'Please select a priority' }),
  }),
  createdBy: z.string().min(1, 'Please select a creator'),
  assignedTo: z.string().optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export const createCommentSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  createdBy: z.string().min(1, 'Please select a user'),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;

export const updateTicketSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assignedTo: z.string().optional(),
});

export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>;
