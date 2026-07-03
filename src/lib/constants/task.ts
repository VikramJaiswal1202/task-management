import { TaskStatus, TaskPriority } from '@/types'

export const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
  submitted: { label: 'Submitted', className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
  overdue: { label: 'Overdue', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  locked: { label: 'Locked', className: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
}

export const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  high: { label: 'High', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' },
}