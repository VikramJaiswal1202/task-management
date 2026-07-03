'use client'

import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import { queryKeys } from '@/lib/store/query-keys'

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard('admin'),
    queryFn: () => analyticsService.getAdminDashboardStats(),
    staleTime: 2 * 60 * 1000,
  })
}

export function useUserDashboardStats(userId: string) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(`user-${userId}`),
    queryFn: () => analyticsService.getUserDashboardStats(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useTasksByStatus() {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'tasks-by-status'],
    queryFn: () => analyticsService.getTasksByStatus(),
  })
}

export function useTasksByPriority() {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'tasks-by-priority'],
    queryFn: () => analyticsService.getTasksByPriority(),
  })
}

export function useTasksPerMonth(months = 6) {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'tasks-per-month', months],
    queryFn: () => analyticsService.getTasksPerMonth(months),
  })
}