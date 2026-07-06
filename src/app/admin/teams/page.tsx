'use client'

import { useTeams } from '@/hooks/use-teams'
import { TeamCard } from '@/components/features/teams/team-card'
import { CreateTeamDialog } from '@/components/features/teams/create-team-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Users } from 'lucide-react'

export default function AdminTeamsPage() {
  const { data: teams, isLoading } = useTeams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teams</h1>
          <p className="text-muted-foreground">Organize users into teams and assign team leads</p>
        </div>
        <CreateTeamDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : !teams || teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Users className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">No teams yet</p>
          <p className="text-xs text-muted-foreground">Create your first team to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  )
}