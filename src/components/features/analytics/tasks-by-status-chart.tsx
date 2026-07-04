'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { calendarColorMap } from '@/lib/constants/calendar'
import { statusConfig } from '@/lib/constants/task'
import { ChartCard } from './chart-card'
import { TaskStatus } from '@/types'

interface TasksByStatusChartProps {
  data: { status: string; count: number }[]
}

export function TasksByStatusChart({ data }: TasksByStatusChartProps) {
  if (!data || data.length === 0) return null

  const chartData = data.map((d) => ({
    name: statusConfig[d.status as TaskStatus]?.label ?? d.status,
    value: d.count,
    color: calendarColorMap[d.status as TaskStatus] ?? '#94a3b8',
  }))

  return (
    <ChartCard title="Tasks by Status">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}