import { z } from 'zod';
import { ACCOUNT_ROLES, BOOKING_STATUSES, PAYMENT_METHODS } from './enums.js';

export const emailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/);
export const passwordSchema = z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/);

export const registerSchema = z
  .object({
    role: z.enum(ACCOUNT_ROLES).exclude(['ADMIN']),
    name: z.string().trim().min(2).max(120),
    mobile: phoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptedTerms: z.literal(true),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export const verifyOtpSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/),
});

export const resendOtpSchema = z.object({ challengeId: z.string().uuid() });

export const signInSchema = z.object({
  identifier: z.string().trim().min(3).max(254),
  password: z.string().min(1).max(128),
  rememberMe: z.boolean().default(false),
});

export const passwordResetRequestSchema = z.object({ email: emailSchema });
export const passwordResetConfirmSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/),
  newPassword: passwordSchema,
});

export const refreshSessionSchema = z.object({ refreshToken: z.string().min(32).max(4096) });

export const serviceRequestSchema = z.object({
  serviceCategoryId: z.string().uuid(),
  description: z.string().trim().min(10).max(4000),
  addressId: z.string().uuid(),
  scheduledAt: z.coerce.date().refine((value) => value.getTime() > Date.now()),
  budget: z.coerce.number().positive().max(10_000_000),
  notes: z.string().trim().max(2000).optional(),
  mediaIds: z.array(z.string().uuid()).max(8).default([]),
});

export const bookingTransitionSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
  reason: z.string().trim().min(3).max(1000).optional(),
  version: z.number().int().nonnegative(),
});

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
  method: z.enum(PAYMENT_METHODS),
  idempotencyKey: z.string().min(16).max(128),
});

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  stars: z.number().int().min(1).max(5),
  body: z.string().trim().min(3).max(4000),
  recommendWorker: z.boolean(),
  mediaIds: z.array(z.string().uuid()).max(5).default([]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type BookingTransitionInput = z.infer<typeof bookingTransitionSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
