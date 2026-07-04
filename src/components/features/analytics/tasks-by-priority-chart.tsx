'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { useTasksByPriority } from '@/hooks/use-analytics'
import { priorityConfig } from '@/lib/constants/task'
import { ChartCard } from './chart-card'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskPriority } from '@/types'

const priorityColors: Record<string, string> = {
  low: '#94a3b8',
  medium: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
}

interface TasksByPriorityChartProps {
  data: { priority: string; count: number }[]
}

export function TasksByPriorityChart({ data }: TasksByPriorityChartProps) {
  const { data: analyticsData, isLoading } = useTasksByPriority()

  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-lg" />
  if (!analyticsData || analyticsData.length === 0) return null

  const chartData = data.map((d) => ({
    name: priorityConfig[d.priority as TaskPriority]?.label ?? d.priority,
    count: d.count,
    color: priorityColors[d.priority] ?? '#94a3b8',
  }))

  return (
    <ChartCard title="Tasks by Priority">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}