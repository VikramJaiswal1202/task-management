'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { queryKeys } from '@/lib/store/query-keys'
import { Profile, UserRole } from '@/types'
import { toast } from 'sonner'

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: () => userService.getUsers(),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  })
}

export function useUserTaskStats(userId: string) {
  return useQuery({
    queryKey: [...queryKeys.users.detail(userId), 'stats'],
    queryFn: () => userService.getUserTaskStats(userId),
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Profile> }) =>
      userService.updateProfile(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      toast.success('Profile updated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })
}

export function useChangeUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      userService.changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('User role updated')
    },
  })
}

export function useToggleUserActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate ? userService.activateUser(id) : userService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('User status updated')
    },
  })
}