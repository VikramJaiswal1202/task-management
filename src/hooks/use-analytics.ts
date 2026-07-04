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
export function useUserTasksByStatus(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'user-tasks-by-status', userId],
    queryFn: () => analyticsService.getUserTasksByStatus(userId),
    enabled: !!userId,
  })
}

export function useUserTasksByPriority(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'user-tasks-by-priority', userId],
    queryFn: () => analyticsService.getUserTasksByPriority(userId),
    enabled: !!userId,
  })
}

export function useUserTasksPerMonth(userId: string, months = 6) {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'user-tasks-per-month', userId, months],
    queryFn: () => analyticsService.getUserTasksPerMonth(userId, months),
    enabled: !!userId,
  })
}

export function useUserAvgCompletionTime(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'user-avg-completion', userId],
    queryFn: () => analyticsService.getUserAvgCompletionTime(userId),
    enabled: !!userId,
  })
}