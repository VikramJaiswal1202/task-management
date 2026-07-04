'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService, TaskFilters } from '@/services/task.service'
import { queryKeys } from '@/lib/store/query-keys'
import { TaskInsert, TaskUpdate } from '@/types'
import { toast } from 'sonner'

import { activityService } from '@/services/activity.service'
import { createClient } from '@/lib/supabase/client'

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}
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
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task created successfully')

      // Notify the assignee if this was an admin-assigned task (not a personal task)
      if (data.task_type === 'assigned' && data.assigned_to && data.assigned_by) {
        const supabase = createClient()
        await supabase.from('notifications').insert({
          user_id: data.assigned_to,
          title: 'New Task Assigned',
          message: `You've been assigned a new task: "${data.title}"`,
          type: 'task_assigned',
          related_task_id: data.id,
        })
      }
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
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
      toast.success('Task updated')

      const userId = await getCurrentUserId()
      if (userId) {
        activityService.logActivity({
          user_id: userId,
          action: 'task_updated',
          entity_type: 'task',
          entity_id: variables.id,
          metadata: variables.updates,
        })
      }
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
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task deleted')

      const userId = await getCurrentUserId()
      if (userId) {
        activityService.logActivity({ user_id: userId, action: 'task_deleted', entity_type: 'task', entity_id: id })
      }
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
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task locked')

      const userId = await getCurrentUserId()
      if (userId) {
        activityService.logActivity({ user_id: userId, action: 'task_locked', entity_type: 'task', entity_id: id })
      }
    },
  })
}

export function useUnlockTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.unlockTask(id),
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() })
      toast.success('Task unlocked')

      const userId = await getCurrentUserId()
      if (userId) {
        activityService.logActivity({ user_id: userId, action: 'task_unlocked', entity_type: 'task', entity_id: id })
      }
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

export function useCalendarTasks(userId: string, role: string) {
  return useQuery({
    queryKey: [...queryKeys.tasks.all, 'calendar', userId, role],
    queryFn: () => taskService.getTasksForCalendar(userId, role),
    enabled: !!userId,
  })

}
export function useActiveAssignedTasks(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.tasks.all, 'active-assigned', userId],
    queryFn: () => taskService.getActiveAssignedTasks(userId),
    enabled: !!userId,
  })
}
