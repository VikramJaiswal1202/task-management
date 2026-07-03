'use client'

import { useParams, useRouter } from 'next/navigation'
import { useTask, useMarkTaskComplete, useDeleteTask, useLockTask, useUnlockTask } from '@/hooks/use-tasks'
import { useCurrentUser } from '@/hooks/use-current-user'
import { StatusBadge, PriorityBadge } from '@/components/features/tasks/task-badges'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Calendar,
  User,
  Lock,
  Unlock,
  Trash2,
  CheckCircle,
  FileText,
} from 'lucide-react'
import { format, isPast } from 'date-fns'
import { useState } from 'react'
import { ReportForm } from '@/components/features/reports/report-form'
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

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const { data: task, isLoading } = useTask(taskId)
  const { data: currentUser } = useCurrentUser()
  const markComplete = useMarkTaskComplete()
  const deleteTask = useDeleteTask()
  const lockTask = useLockTask()
  const unlockTask = useUnlockTask()

  const [reportFormOpen, setReportFormOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!task) {
    return <p className="text-muted-foreground">Task not found</p>
  }

  const isAdmin = currentUser?.profile.role === 'admin'
  const isOwner = task.assigned_to === currentUser?.id || task.created_by === currentUser?.id
  const overdue = isPast(new Date(task.deadline)) && !['completed', 'approved'].includes(task.status)
  const canMarkComplete = isOwner && !task.locked && !['completed', 'submitted', 'approved'].includes(task.status)
  const canEdit = isAdmin || (task.task_type === 'personal' && task.created_by === currentUser?.id && !task.locked)
  const canSubmitReport = isOwner && task.status === 'completed' && !task.locked

  const handleDelete = async () => {
    await deleteTask.mutateAsync(taskId)
    router.push('/dashboard/tasks')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="rounded-lg border bg-background p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {task.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
              <h1 className="text-xl font-semibold">{task.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              {task.locked ? (
                <Button variant="outline" size="sm" onClick={() => unlockTask.mutate(taskId)}>
                  <Unlock className="mr-2 h-4 w-4" />
                  Unlock
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => lockTask.mutate(taskId)}>
                  <Lock className="mr-2 h-4 w-4" />
                  Lock
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task and its associated reports.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {task.description && (
          <div className="mb-4 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p className="text-sm">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={overdue ? 'font-medium text-destructive' : ''}>
              Due {format(new Date(task.deadline), 'PPP p')}
            </span>
          </div>

          {task.assigned_to_profile && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Assigned to {task.assigned_to_profile.full_name}</span>
            </div>
          )}
        </div>

        {(canMarkComplete || canSubmitReport) && (
          <>
            <Separator className="my-4" />
            <div className="flex gap-2">
              {canMarkComplete && (
                <Button onClick={() => markComplete.mutate(taskId)} disabled={markComplete.isPending}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              )}
              {canSubmitReport && (
                <Button onClick={() => setReportFormOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Report
                </Button>
              )}
            </div>
          </>
        )}

        {task.locked && (
          <p className="mt-4 text-xs text-muted-foreground">
            This task is locked because its deadline has passed without submission. Contact an admin to unlock it.
          </p>
        )}
      </div>

      <ReportForm
        open={reportFormOpen}
        onOpenChange={setReportFormOpen}
        taskId={taskId}
        userId={currentUser?.id ?? ''}
      />
    </div>
  )
}