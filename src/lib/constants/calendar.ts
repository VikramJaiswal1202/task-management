import { TaskStatus } from '@/types'

export const calendarColorMap: Record<TaskStatus, string> = {
  pending: '#64748b',
  in_progress: '#3b82f6',
  completed: '#22c55e',
  submitted: '#a855f7',
  approved: '#10b981',
  rejected: '#ef4444',
  overdue: '#f97316',
  locked: '#6b7280',
}