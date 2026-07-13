import { z } from 'zod';

export const prioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
  errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, HIGH, or CRITICAL' }),
});

export const ticketStatusSchema = z.enum(
  ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'],
  {
    errorMap: () => ({
      message: 'Status must be OPEN, IN_PROGRESS, RESOLVED, CLOSED, or CANCELLED',
    }),
  },
);

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const createTicketSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters'),
  priority: prioritySchema,
  createdBy: z.string({ required_error: 'createdBy is required' }).min(1, 'createdBy is required'),
  assignedTo: z.string().min(1).optional().nullable(),
});

export const updateTicketSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be at most 200 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    priority: prioritySchema.optional(),
    assignedTo: z.string().min(1).nullable().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined ||
      data.assignedTo !== undefined,
    { message: 'At least one field must be provided', path: ['body'] },
  );

export const updateStatusSchema = z.object({
  status: ticketStatusSchema,
});

export const createCommentSchema = z.object({
  message: z
    .string({ required_error: 'Message is required' })
    .min(1, 'Message is required'),
  createdBy: z
    .string({ required_error: 'createdBy is required' })
    .min(1, 'createdBy is required'),
});

export const searchTicketsSchema = z.object({
  q: z.string().optional(),
  status: ticketStatusSchema.optional(),
});

export type CreateTicketBody = z.infer<typeof createTicketSchema>;
export type UpdateTicketBody = z.infer<typeof updateTicketSchema>;
export type UpdateStatusBody = z.infer<typeof updateStatusSchema>;
export type CreateCommentBody = z.infer<typeof createCommentSchema>;
export type SearchTicketsQuery = z.infer<typeof searchTicketsSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
