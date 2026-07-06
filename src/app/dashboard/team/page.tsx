'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { useTeamMembers } from '@/hooks/use-teams'
import { useTeamTasks } from '@/hooks/use-tasks'
import { useTeamReports } from '@/hooks/use-reports'
import { StatusBadge, PriorityBadge } from '@/components/features/tasks/task-badges'
import { ReportReviewCard } from '@/components/features/reports/report-review-card'
import { TaskForm } from '@/components/features/tasks/task-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'

export default function MyTeamPage() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser()
  const [formOpen, setFormOpen] = useState(false)

  const teamId = currentUser?.profile.team_id ?? ''
  const { data: members, isLoading: membersLoading } = useTeamMembers(teamId)
  const { data: tasks, isLoading: tasksLoading } = useTeamTasks(teamId)
  const { data: reports, isLoading: reportsLoading } = useTeamReports(teamId)

  if (userLoading) return <p className="text-muted-foreground">Loading...</p>

  if (!currentUser?.profile.is_team_lead) {
    redirect('/dashboard')
  }

  const pendingReports = reports?.filter((r) => r.status === 'submitted') ?? []

  const initials = (name: string | null) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Team</h1>
          <p className="text-muted-foreground">Manage tasks and reports for your team</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="rounded-lg border bg-background p-5">
        <h3 className="mb-3 font-medium">Team Members</h3>
        {membersLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="flex flex-wrap gap-3">
            {members?.map((m) => (
              <div key={m.id} className="flex items-center gap-2 rounded-md border px-3 py-1.5">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={m.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs">{initials(m.full_name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{m.full_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-medium">Team Tasks</h3>
        {tasksLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No tasks yet for your team
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/tasks/${task.id}`}
                className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Assigned to {task.assigned_to_profile?.full_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-medium">Pending Reports ({pendingReports.length})</h3>
        {reportsLoading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : pendingReports.length === 0 ? (
          <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No reports pending review
          </p>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <ReportReviewCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>

      <TaskForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}