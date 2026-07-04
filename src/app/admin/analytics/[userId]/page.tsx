'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUser, useUserTaskStats } from '@/hooks/use-users'
import {
  useUserTasksByStatus,
  useUserTasksByPriority,
  useUserTasksPerMonth,
  useUserAvgCompletionTime,
} from '@/hooks/use-analytics'
import { TasksByStatusChart } from '@/components/features/analytics/tasks-by-status-chart'
import { TasksByPriorityChart } from '@/components/features/analytics/tasks-by-priority-chart'
import { TasksTrendChart } from '@/components/features/analytics/tasks-trend-chart'
import { StatCard } from '@/components/features/dashboard/stat-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, ListTodo, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

export default function UserAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string

  const { data: user, isLoading: userLoading } = useUser(userId)
  const { data: stats } = useUserTaskStats(userId)
  const { data: statusData } = useUserTasksByStatus(userId)
  const { data: priorityData } = useUserTasksByPriority(userId)
  const { data: trendData } = useUserTasksPerMonth(userId, 6)
  const { data: avgCompletionHours } = useUserAvgCompletionTime(userId)

  if (userLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!user) return <p className="text-muted-foreground">User not found</p>

  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Analytics
      </Button>

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user.avatar_url ?? undefined} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">{user.full_name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title="Total Tasks" value={stats?.total ?? 0} icon={ListTodo} />
        <StatCard
          title="Completion Rate"
          value={`${stats?.completionRate ?? 0}%`}
          icon={CheckCircle}
          className="text-green-500"
        />
        <StatCard title="Overdue" value={stats?.overdue ?? 0} icon={AlertTriangle} className="text-orange-500" />
        <StatCard
          title="Avg. Completion Time"
          value={avgCompletionHours ? `${avgCompletionHours}h` : 'N/A'}
          icon={Clock}
          className="text-blue-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {statusData && <TasksByStatusChart data={statusData} />}
        {priorityData && <TasksByPriorityChart data={priorityData} />}
        {trendData && trendData.length > 0 && <TasksTrendChart data={trendData} />}
      </div>
    </div>
  )
}