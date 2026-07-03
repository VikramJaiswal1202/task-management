import { Badge } from '@/components/ui/badge'
import { statusConfig, priorityConfig } from '@/lib/constants/task'
import { TaskStatus, TaskPriority } from '@/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="secondary" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityConfig[priority]
  return (
    <Badge variant="secondary" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  )
}