import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  deadline: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Deadline must be in the future',
  }),
  taskType: z.enum(['personal', 'assigned']),
  assignedTo: z.string().optional(),
}).refine(
  (data) => data.taskType !== 'assigned' || !!data.assignedTo,
  { message: 'Please select an assignee', path: ['assignedTo'] }
)

export type TaskFormInput = z.infer<typeof taskSchema>