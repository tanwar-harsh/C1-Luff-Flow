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
  assignedTo: z.string().optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export const createCommentSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;

export const updateTicketSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assignedTo: z.string().optional(),
});

export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

const roleSchema = z.enum(['ADMIN', 'AGENT', 'USER']);

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: roleSchema,
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional().or(z.literal('')),
    role: roleSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      (data.password !== undefined && data.password !== '') ||
      data.role !== undefined,
    { message: 'At least one field must be provided' },
  );

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
