'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService, TaskFilters } from '@/services/task.service'
import { queryKeys } from '@/lib/store/query-keys'
import { TaskInsert, TaskUpdate } from '@/types'
import { toast } from 'sonner'

export function useTasks(userId: string, role: string, filters: TaskFilters = {}) {
  return useQuery({
    queryKey: queryKeys.tasks.list({ userId, role, ...filters }),
    queryFn: () => taskService.getTasks(userId, role, filters),
    enabled: !!userId,
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: TaskInsert) => taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task')
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TaskUpdate }) =>
      taskService.updateTask(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
      toast.success('Task updated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task')
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task')
    },
  })
}

export function useMarkTaskComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.markComplete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(id) })
      toast.success('Task marked as complete')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task')
    },
  })
}

export function useLockTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.lockTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task locked')
    },
  })
}

export function useUnlockTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.unlockTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task unlocked')
    },
  })
}

export function useReassignTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newAssigneeId }: { id: string; newAssigneeId: string }) =>
      taskService.reassignTask(id, newAssigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task reassigned')
    },
  })
}

export function useBulkUpdateTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      taskService.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Tasks updated')
    },
  })
}

export function useBulkDeleteTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => taskService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Tasks deleted')
    },
  })

}
export function useUpcomingDeadlines(limit = 5) {
  return useQuery({
    queryKey: [...queryKeys.tasks.all, 'upcoming', limit],
    queryFn: () => taskService.getUpcomingDeadlines(limit),
  })
}

export function useRecentTasks(limit = 5) {
  return useQuery({
    queryKey: [...queryKeys.tasks.all, 'recent', limit],
    queryFn: () => taskService.getRecentTasks(limit),
  })
}