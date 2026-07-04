import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  department: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  timezone: z.string().min(1, 'Please select a timezone'),
})

export type ProfileFormInput = z.infer<typeof profileSchema>

export const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>