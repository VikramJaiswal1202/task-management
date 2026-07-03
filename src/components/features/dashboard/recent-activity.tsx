'use client'

import Link from 'next/link'
import { useRecentTasks } from '@/hooks/use-tasks'
import { StatusBadge } from '@/components/features/tasks/task-badges'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

export function RecentActivity() {
  const { data: tasks, isLoading } = useRecentTasks(5)

  return (
    <div className="rounded-lg border bg-background p-5">
      <h3 className="mb-3 font-medium">Recent Activity</h3>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity</p>
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
                  Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                </p>
              </div>
              <StatusBadge status={task.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}