'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useCalendarTasks } from '@/hooks/use-tasks'
import { calendarColorMap } from '@/lib/constants/calendar'
import { Skeleton } from '@/components/ui/skeleton'

export function TaskCalendar() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const { data: tasks, isLoading } = useCalendarTasks(
    currentUser?.id ?? '',
    currentUser?.profile.role ?? 'user'
  )

  if (isLoading) return <Skeleton className="h-[600px] w-full rounded-lg" />

  const isAdmin = currentUser?.profile.role === 'admin'
  const basePath = isAdmin ? '/admin/tasks' : '/dashboard/tasks'

  const events = (tasks ?? []).map((task) => ({
    id: task.id,
    title: task.title,
    date: task.deadline,
    backgroundColor: calendarColorMap[task.status],
    borderColor: calendarColorMap[task.status],
  }))

  return (
    <div className="rounded-lg border bg-background p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        events={events}
        height="auto"
        eventClick={(info) => {
          router.push(`${basePath}/${info.event.id}`)
        }}
        dayMaxEvents={3}
      />
    </div>
  )
}