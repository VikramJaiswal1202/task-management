'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportService, ReportInput } from '@/services/report.service'
import { queryKeys } from '@/lib/query-keys'
import { toast } from 'sonner'
import { activityService } from '@/services/activity.service'
import { createClient } from '@/lib/supabase/client'

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export function useReports(filters: { status?: string; userId?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.reports.list(filters),
    queryFn: () => reportService.getReports(filters),
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => reportService.getReportById(id),
    enabled: !!id,
  })
}

export function useSubmitReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (report: ReportInput) => reportService.submitReport(report),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.task_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Report submitted successfully')

      const userId = await getCurrentUserId()
      if (userId) {
        activityService.logActivity({
          user_id: userId,
          action: 'report_submitted',
          entity_type: 'task_report',
          entity_id: data.id,
          metadata: { task_id: data.task_id },
        })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit report')
    },
  })
}

export function useApproveReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reviewerId }: { id: string; reviewerId: string }) =>
      reportService.approveReport(id, reviewerId),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.task_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Report approved')

      const userId = await getCurrentUserId()
      if (userId) {
        activityService.logActivity({
          user_id: userId,
          action: 'report_approved',
          entity_type: 'task_report',
          entity_id: data.id,
        })
      }
    },
  })
}

export function useRejectReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reviewerId, reason }: { id: string; reviewerId: string; reason: string }) =>
      reportService.rejectReport(id, reviewerId, reason),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.task_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Report rejected')

      const userId = await getCurrentUserId()
      if (userId) {
        activityService.logActivity({
          user_id: userId,
          action: 'report_rejected',
          entity_type: 'task_report',
          entity_id: data.id,
          metadata: { reason: variables.reason },
        })
      }
    },
  })
}