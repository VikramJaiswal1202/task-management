'use client'

import Link from 'next/link'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useActiveAssignedTasks } from '@/hooks/use-tasks'
import { PriorityBadge, StatusBadge } from '@/components/features/tasks/task-badges'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow, isPast } from 'date-fns'
import { UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AssignedToYou() {
  const { data: currentUser } = useCurrentUser()
  const { data: tasks, isLoading } = useActiveAssignedTasks(currentUser?.id ?? '')

  return (
    <div className="rounded-lg border bg-background p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">Assigned to You</h3>
        {tasks && tasks.length > 0 && (
          <span className="text-xs text-muted-foreground">{tasks.length} active</span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <UserPlus className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No active tasks assigned to you</p>
        </div>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {tasks.map((task) => {
            const overdue = isPast(new Date(task.deadline)) && task.status !== 'completed'

            return (
              <Link
                key={task.id}
                href={`/dashboard/tasks/${task.id}`}
                className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className={cn('text-xs text-muted-foreground', overdue && 'text-destructive')}>
                    Assigned to {task.assigned_to_profile?.full_name ?? 'You'} • {overdue ? 'Overdue: ' : 'Due '}
                    {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}