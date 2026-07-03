'use client'

import { useState } from 'react'
import { TaskFiltersBar } from '@/components/features/tasks/task-filters'
import { TaskList } from '@/components/features/tasks/task-list'
import { TaskForm } from '@/components/features/tasks/task-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function TasksPage() {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskFiltersBar />
      <TaskList />

      <TaskForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}