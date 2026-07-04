'use client'

import { useState } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { TaskForm } from '@/components/features/tasks/task-form'
import { AssignedToYou } from '@/components/features/dashboard/assigned-to-you'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const { data, isLoading } = useCurrentUser()
  const [formOpen, setFormOpen] = useState(false)

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {data?.profile.full_name}</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <AssignedToYou />

      <TaskForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}