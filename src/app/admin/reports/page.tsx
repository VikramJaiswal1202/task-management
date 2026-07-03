'use client'

import { useState } from 'react'
import { useReports } from '@/hooks/use-reports'
import { ReportReviewCard } from '@/components/features/reports/report-review-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminReportsPage() {
  const [statusFilter, setStatusFilter] = useState('submitted')

  const { data: reports, isLoading } = useReports({
    status: statusFilter === 'all' ? undefined : statusFilter,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Report Reviews</h1>
          <p className="text-muted-foreground">Review and approve submitted task reports</p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submitted">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="all">All Reports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : !reports || reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">No reports found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportReviewCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}