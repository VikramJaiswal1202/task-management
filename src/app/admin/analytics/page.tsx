'use client'

import Link from 'next/link'
import { useUsers } from '@/hooks/use-users'
import { useTasksByStatus, useTasksByPriority, useTasksPerMonth } from '@/hooks/use-analytics'
import { TasksByStatusChart } from '@/components/features/analytics/tasks-by-status-chart'
import { TasksByPriorityChart } from '@/components/features/analytics/tasks-by-priority-chart'
import { TasksTrendChart } from '@/components/features/analytics/tasks-trend-chart'
import { CompletionRateChart } from '@/components/features/analytics/completion-rate-chart'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronRight } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const { data: statusData } = useTasksByStatus()
  const { data: priorityData } = useTasksByPriority()
  const { data: trendData } = useTasksPerMonth(6)
  const { data: users } = useUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">Organization-wide task insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {statusData && <TasksByStatusChart data={statusData} />}
        {priorityData && <TasksByPriorityChart data={priorityData} />}
        {trendData && <TasksTrendChart data={trendData} />}
        <CompletionRateChart />
      </div>

      <div className="rounded-lg border bg-background p-5">
        <h3 className="mb-3 font-medium">Per-User Analytics</h3>
        <p className="mb-4 text-sm text-muted-foreground">Click a user to see their individual performance</p>
        <div className="space-y-1">
          {users?.map((user) => {
            const initials = user.full_name
              ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
              : user.email[0].toUpperCase()

            return (
              <Link
                key={user.id}
                href={`/admin/analytics/${user.id}`}
                className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url ?? undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}