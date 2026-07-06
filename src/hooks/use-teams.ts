'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamService } from '@/services/team.service'
import { queryKeys } from '@/lib/query-keys'
import { toast } from 'sonner'

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeams(),
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name, createdBy }: { name: string; createdBy: string }) =>
      teamService.createTeam(name, createdBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast.success('Team created')
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create team'),
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Team deleted')
    },
  })
}

export function useAssignMemberToTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, teamId }: { userId: string; teamId: string | null }) =>
      teamService.assignMemberToTeam(userId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Team membership updated')
    },
  })
}

export function useSetTeamLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, teamId, isLead }: { userId: string; teamId: string; isLead: boolean }) =>
      teamService.setTeamLead(userId, teamId, isLead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Team lead updated')
    },
  })
}

export function useRemoveFromTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => teamService.removeFromTeam(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      toast.success('Removed from team')
    },
  })
}
export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: ['teams', teamId, 'members'],
    queryFn: () => teamService.getTeamMembers(teamId),
    enabled: !!teamId,
  })
}