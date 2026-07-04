'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { useTasksPerMonth } from '@/hooks/use-analytics'
import { ChartCard } from './chart-card'
import { Skeleton } from '@/components/ui/skeleton'

interface TasksTrendChartProps {
  data: { month: string; count: number }[]
}

export function TasksTrendChart({ data }: TasksTrendChartProps) {
  const { data: analyticsData, isLoading } = useTasksPerMonth(6)

  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-lg" />
  if (!analyticsData || analyticsData.length === 0) return null

  return (
    <ChartCard title="Task Creation Trend (Last 6 Months)">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}