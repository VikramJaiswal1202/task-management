'use client'

import { useState } from 'react'
import { Team, Profile } from '@/types'
import { useUsers } from '@/hooks/use-users'
import { useAssignMemberToTeam, useSetTeamLead, useRemoveFromTeam, useDeleteTeam } from '@/hooks/use-teams'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Crown, X, Trash2, UserPlus } from 'lucide-react'

interface TeamCardProps {
  team: Team & { members: Profile[] }
}

export function TeamCard({ team }: TeamCardProps) {
  const { data: allUsers } = useUsers()
  const assignMember = useAssignMemberToTeam()
  const setTeamLead = useSetTeamLead()
  const removeFromTeam = useRemoveFromTeam()
  const deleteTeam = useDeleteTeam()
  const [addingMember, setAddingMember] = useState(false)

  const lead = team.members.find((m) => m.is_team_lead)
  const unassignedUsers = allUsers?.filter((u) => !u.team_id && u.role !== 'admin') ?? []

  const initials = (name: string | null) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  return (
    <div className="rounded-lg border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">{team.name}</h3>
          <p className="text-xs text-muted-foreground">{team.members.length} members</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {team.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                All members will be unassigned from this team. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTeam.mutate(team.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-2">
        {team.members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members yet</p>
        ) : (
          team.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={member.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs">{initials(member.full_name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{member.full_name}</span>
                {member.is_team_lead && (
                  <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700">
                    <Crown className="h-3 w-3" />
                    Lead
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {!member.is_team_lead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setTeamLead.mutate({ userId: member.id, teamId: team.id, isLead: true })}
                  >
                    Make Lead
                  </Button>
                )}
                {member.is_team_lead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setTeamLead.mutate({ userId: member.id, teamId: team.id, isLead: false })}
                  >
                    Remove Lead
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeFromTeam.mutate(member.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3">
        {addingMember ? (
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(userId) => {
                assignMember.mutate({ userId, teamId: team.id })
                setAddingMember(false)
              }}
            >
              <SelectTrigger className="h-8 flex-1">
                <SelectValue placeholder="Select a user to add" />
              </SelectTrigger>
              <SelectContent>
                {unassignedUsers.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No unassigned users</div>
                ) : (
                  unassignedUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => setAddingMember(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full" onClick={() => setAddingMember(true)}>
            <UserPlus className="mr-2 h-3.5 w-3.5" />
            Add Member
          </Button>
        )}
      </div>
    </div>
  )
}