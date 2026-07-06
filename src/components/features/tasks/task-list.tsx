'use client'

import Link from 'next/link'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useTasks } from '@/hooks/use-tasks'
import { useFiltersStore } from '@/lib/store/filters-store'
import { StatusBadge, PriorityBadge } from './task-badges'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow, isPast } from 'date-fns'
import { Lock, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TaskList() {
  const { data: currentUser } = useCurrentUser()
  const filters = useFiltersStore()

  const { data: tasks, isLoading } = useTasks(
    currentUser?.id ?? '',
    currentUser?.profile.role ?? 'user',
    {
      status: filters.status,
      priority: filters.priority,
      search: filters.search,
      sortBy: filters.sortBy,
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">No tasks found</p>
        <p className="text-xs text-muted-foreground">Try adjusting your filters or create a new task</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const overdue = isPast(new Date(task.deadline)) && task.status !== 'completed' && task.status !== 'approved'

        return (
          <Link
            key={task.id}
            href={`/dashboard/tasks/${task.id}`}
            className="flex items-center justify-between rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex-1 space-y-1">
  <div className="flex items-center gap-2">
    {task.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
    <h3 className="font-medium">{task.title}</h3>
  </div>
  {task.description && (
    <p className="line-clamp-1 text-sm text-muted-foreground">{task.description}</p>
  )}
  <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', overdue && 'text-destructive')}>
    <Calendar className="h-3 w-3" />
    <span>
      {overdue ? 'Overdue: ' : 'Due '}
      {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
    </span>
  </div>
  {task.task_type === 'assigned' && task.assigned_by_profile && (
    <p className="text-xs text-muted-foreground">
      Assigned by <span className="font-medium">{task.assigned_by_profile.full_name}</span>
    </p>
  )}
</div>

            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}