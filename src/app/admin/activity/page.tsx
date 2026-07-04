'use client'

import { useActivityLogs } from '@/hooks/use-activity-logs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import {
  Plus,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  FileText,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  type LucideIcon,
} from 'lucide-react'

interface ActivityLog {
  id: string
  action: string
  created_at: string
  user?: {
    full_name?: string | null
    avatar_url?: string | null
  } | null
}

const actionConfig: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  task_created: { label: 'created a task', icon: Plus, color: 'text-blue-500' },
  task_updated: { label: 'updated a task', icon: Pencil, color: 'text-amber-500' },
  task_deleted: { label: 'deleted a task', icon: Trash2, color: 'text-red-500' },
  task_locked: { label: 'locked a task', icon: Lock, color: 'text-gray-500' },
  task_unlocked: { label: 'unlocked a task', icon: Unlock, color: 'text-gray-500' },
  report_submitted: { label: 'submitted a report', icon: FileText, color: 'text-purple-500' },
  report_approved: { label: 'approved a report', icon: CheckCircle, color: 'text-green-500' },
  report_rejected: { label: 'rejected a report', icon: XCircle, color: 'text-red-500' },
  login: { label: 'logged in', icon: LogIn, color: 'text-green-500' },
  logout: { label: 'logged out', icon: LogOut, color: 'text-gray-500' },
}

export default function ActivityLogPage() {
  const { data: logs, isLoading } = useActivityLogs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Activity Log</h1>
        <p className="text-muted-foreground">Track every action across the organization</p>
      </div>

      <div className="rounded-lg border bg-background">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !logs || logs.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No activity yet</p>
        ) : (
          <div className="divide-y">
            {logs.map((log: ActivityLog) => {
              const config = actionConfig[log.action] ?? {
                label: log.action,
                icon: Pencil,
                color: 'text-muted-foreground',
              }
              const Icon = config.icon
              const initials = log.user?.full_name
                ? log.user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                : '?'

              return (
                <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={log.user?.avatar_url ?? undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <p className="flex-1 text-sm">
                    <span className="font-medium">{log.user?.full_name ?? 'Unknown'}</span>{' '}
                    <span className="text-muted-foreground">{config.label}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}