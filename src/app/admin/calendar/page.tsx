import { TaskCalendar } from '@/components/features/calendar/task-calendar'

export default function AdminCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-muted-foreground">Organization-wide task deadlines</p>
      </div>
      <TaskCalendar />
    </div>
  )
}