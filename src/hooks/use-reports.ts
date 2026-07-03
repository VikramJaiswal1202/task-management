'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportService, ReportInput } from '@/services/report.service'
import { queryKeys } from '@/lib/store/query-keys'
import { toast } from 'sonner'

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.task_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Report submitted successfully')
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.task_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Report approved')
    },
  })
}

export function useRejectReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reviewerId, reason }: { id: string; reviewerId: string; reason: string }) =>
      reportService.rejectReport(id, reviewerId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.task_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Report rejected')
    },
  })
}