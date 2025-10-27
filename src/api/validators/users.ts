import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .max(16, { message: 'Password must be less than 16 characters' }),
  }),
});

export const activateUserSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'Token is required' }),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

export const resendActivationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'Token is required' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .max(16, { message: 'Password must be less than 16 characters' }),
  }),
});
