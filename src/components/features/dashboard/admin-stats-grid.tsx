'use client'

import { useAdminDashboardStats } from '@/hooks/use-analytics'
import { StatCard } from './stat-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, ListTodo, CheckCircle, Lock, AlertTriangle, FileClock } from 'lucide-react'

export function AdminStatsGrid() {
  const { data: stats, isLoading } = useAdminDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
      <StatCard title="Active Tasks" value={stats.activeTasks} icon={ListTodo} className="text-blue-500" />
      <StatCard title="Completed" value={stats.completedTasks} icon={CheckCircle} className="text-green-500" />
      <StatCard title="Locked" value={stats.lockedTasks} icon={Lock} className="text-gray-500" />
      <StatCard title="Overdue" value={stats.overdueTasks} icon={AlertTriangle} className="text-orange-500" />
      <StatCard title="Pending Reports" value={stats.pendingReports} icon={FileClock} className="text-purple-500" />
    </div>
  )
}