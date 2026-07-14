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
});

export const searchTicketsSchema = z.object({
  q: z.string().optional(),
  status: ticketStatusSchema.optional(),
});

export const roleSchema = z.enum(['ADMIN', 'AGENT', 'USER']);

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const adminCreateUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  role: roleSchema,
});

export const adminUpdateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).max(128).optional(),
    role: roleSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.password !== undefined ||
      data.role !== undefined,
    { message: 'At least one field must be provided', path: ['body'] },
  );

export const updateMeSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: 'At least one field must be provided',
    path: ['body'],
  });

export type CreateTicketBody = z.infer<typeof createTicketSchema>;
export type UpdateTicketBody = z.infer<typeof updateTicketSchema>;
export type UpdateStatusBody = z.infer<typeof updateStatusSchema>;
export type CreateCommentBody = z.infer<typeof createCommentSchema>;
export type SearchTicketsQuery = z.infer<typeof searchTicketsSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type AdminCreateUserBody = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserBody = z.infer<typeof adminUpdateUserSchema>;
export type UpdateMeBody = z.infer<typeof updateMeSchema>;
