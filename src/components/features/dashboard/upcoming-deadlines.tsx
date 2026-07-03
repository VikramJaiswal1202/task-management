'use client'

import Link from 'next/link'
import { useUpcomingDeadlines } from '@/hooks/use-tasks'
import { PriorityBadge } from '@/components/features/tasks/task-badges'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

export function UpcomingDeadlines() {
  const { data: tasks, isLoading } = useUpcomingDeadlines(5)

  return (
    <div className="rounded-lg border bg-background p-5">
      <h3 className="mb-3 font-medium">Upcoming Deadlines</h3>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/admin/tasks/${task.id}`}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  {task.assigned_to_profile?.full_name ?? 'Unassigned'} • due{' '}
                  {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                </p>
              </div>
              <PriorityBadge priority={task.priority} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}