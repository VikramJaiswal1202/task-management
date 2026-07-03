import { z } from 'zod'

export const reportSchema = z.object({
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(500),
  description: z.string().max(2000).optional(),
  timeTaken: z.string().max(100).optional(),
  challengesFaced: z.string().max(1000).optional(),
  outcome: z.string().max(1000).optional(),
  additionalNotes: z.string().max(1000).optional(),
})

export type ReportFormInput = z.infer<typeof reportSchema>

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'image/png',
  'image/jpeg',
  'image/webp',
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB