'use client'

import { useState } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useTasks, useBulkUpdateTasks, useBulkDeleteTasks } from '@/hooks/use-tasks'
import { useFiltersStore } from '@/lib/store/filters-store'
import { TaskFiltersBar } from '@/components/features/tasks/task-filters'
import { StatusBadge, PriorityBadge } from '@/components/features/tasks/task-badges'
import { TaskForm } from '@/components/features/tasks/task-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import Link from 'next/link'
import { Plus, Download, Trash2, Lock, Unlock } from 'lucide-react'
import { format } from 'date-fns'
import { exportTasksToCSV } from '@/lib/utils/export'
import { taskService } from '@/services/task.service'

export default function AdminTasksPage() {
  const { data: currentUser } = useCurrentUser()
  const filters = useFiltersStore()
  const [selected, setSelected] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)

  const { data: tasks, isLoading } = useTasks(currentUser?.id ?? '', 'admin', {
    status: filters.status,
    priority: filters.priority,
    search: filters.search,
    sortBy: filters.sortBy,
  })

  const bulkUpdate = useBulkUpdateTasks()
  const bulkDelete = useBulkDeleteTasks()

  const allSelected = tasks && tasks.length > 0 && selected.length === tasks.length

  const toggleAll = () => {
    if (!tasks) return
    setSelected(allSelected ? [] : tasks.map((t) => t.id))
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleBulkLock = async (locked: boolean) => {
    await taskService.bulkLock(selected, locked)
    setSelected([])
    window.location.reload() // simplest way to refresh table state after a raw service call
  }

  const handleBulkDelete = async () => {
    await bulkDelete.mutateAsync(selected)
    setSelected([])
  }

  const handleExport = () => {
    if (!tasks) return
    const tasksToExport = selected.length > 0 ? tasks.filter((t) => selected.includes(t.id)) : tasks
    exportTasksToCSV(tasksToExport)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">All Tasks</h1>
          <p className="text-muted-foreground">Organization-wide task management</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskFiltersBar />

      {selected.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium">{selected.length} selected</span>
          <div className="ml-auto flex gap-2">
            <Select onValueChange={(status) => bulkUpdate.mutate({ ids: selected, status })}>
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => handleBulkLock(true)}>
              <Lock className="mr-1 h-3.5 w-3.5" />
              Lock
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkLock(false)}>
              <Unlock className="mr-1 h-3.5 w-3.5" />
              Unlock
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-1 h-3.5 w-3.5" />
              Export
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selected.length} tasks?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {!selected.length && tasks && tasks.length > 0 && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="mr-1 h-3.5 w-3.5" />
            Export All
          </Button>
        </div>
      )}

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : !tasks || tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(task.id)} onCheckedChange={() => toggleOne(task.id)} />
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/tasks/${task.id}`} className="font-medium hover:underline">
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.assigned_to_profile?.full_name ?? '—'}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(task.deadline), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaskForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}