import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  className?: string
  trend?: string
}

export function StatCard({ title, value, icon: Icon, className, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-background p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className={cn('h-4 w-4 text-muted-foreground', className)} />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
    </div>
  )
}