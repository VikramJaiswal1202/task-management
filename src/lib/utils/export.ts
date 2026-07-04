import { TaskWithProfiles } from '@/types'
import { format } from 'date-fns'

export function exportTasksToCSV(tasks: TaskWithProfiles[]) {
  const headers = ['Title', 'Description', 'Priority', 'Status', 'Assigned To', 'Deadline', 'Created At']

  const rows = tasks.map((t) => [
    escapeCSV(t.title),
    escapeCSV(t.description ?? ''),
    t.priority,
    t.status,
    escapeCSV(t.assigned_to_profile?.full_name ?? 'Unassigned'),
    format(new Date(t.deadline), 'yyyy-MM-dd HH:mm'),
    format(new Date(t.created_at), 'yyyy-MM-dd HH:mm'),
  ])

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `tasks-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}