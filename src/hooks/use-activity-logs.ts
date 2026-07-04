'use client'

import { useQuery } from '@tanstack/react-query'
import { activityService } from '@/services/activity.service'

export function useActivityLogs(filters: { userId?: string; limit?: number } = {}) {
  return useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: () => activityService.getActivityLogs(filters),
  })
}