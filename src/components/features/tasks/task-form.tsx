'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, TaskFormInput } from '@/lib/validations/task'
import { useCreateTask } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useActivityLogs } from '@/hooks/use-activity-logs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskForm({ open, onOpenChange }: TaskFormProps) {
  const activityLogs = useActivityLogs()
  const { data: currentUser } = useCurrentUser()
  const { data: users } = useUsers()
  const createTask = useCreateTask()
  const isAdmin = currentUser?.profile.role === 'admin'

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      taskType: 'personal',
    },
  })

  const taskType = watch('taskType')

  const onSubmit = async (data: TaskFormInput) => {
    if (!currentUser) return

    await createTask.mutateAsync({
      title: data.title,
      description: data.description,
      priority: data.priority,
      deadline: new Date(data.deadline).toISOString(),
      task_type: data.taskType,
      created_by: currentUser.id,
      assigned_to: data.taskType === 'assigned' ? data.assignedTo : currentUser.id,
      assigned_by: data.taskType === 'assigned' ? currentUser.id : null,
      status: 'pending',
    })
    // Refresh activity logs after creating a task
    activityLogs?.refetch?.()

    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Task details..." rows={3} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(val) => setValue('priority', val as TaskFormInput['priority'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="datetime-local" {...register('deadline')} />
              {errors.deadline && (
                <p className="text-sm text-destructive">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <Label>Task Type</Label>
              <Select
                defaultValue="personal"
                onValueChange={(val) => setValue('taskType', val as TaskFormInput['taskType'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Task</SelectItem>
                  <SelectItem value="assigned">Assign to User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {isAdmin && taskType === 'assigned' && (
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select onValueChange={(val) => setValue('assignedTo', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedTo && (
                <p className="text-sm text-destructive">{errors.assignedTo.message}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}