'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useAdminDashboardStats } from '@/hooks/use-analytics'
import { ChartCard } from './chart-card'
import { Skeleton } from '@/components/ui/skeleton'

export function CompletionRateChart() {
  const { data: stats, isLoading } = useAdminDashboardStats()

  if (isLoading) return <Skeleton className="h-[280px] w-full rounded-lg" />
  if (!stats) return null

  const data = [
    { name: 'Completed', value: stats.completionRate },
    { name: 'Remaining', value: 100 - stats.completionRate },
  ]

  return (
    <ChartCard title="Overall Completion Rate">
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-semibold">{stats.completionRate}%</span>
          <span className="text-xs text-muted-foreground">Completion Rate</span>
        </div>
      </div>
    </ChartCard>
  )
}