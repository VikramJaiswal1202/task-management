import { AdminStatsGrid } from '@/components/features/dashboard/admin-stats-grid'
import { UpcomingDeadlines } from '@/components/features/dashboard/upcoming-deadlines'
import { RecentActivity } from '@/components/features/dashboard/recent-activity'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Organization-wide overview</p>
      </div>

      <AdminStatsGrid />

      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingDeadlines />
        <RecentActivity />
      </div>
    </div>
  )
}