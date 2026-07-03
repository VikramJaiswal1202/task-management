'use client'

import { useState } from 'react'
import { TaskReport } from '@/types'
import { useApproveReport, useRejectReport } from '@/hooks/use-reports'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { AttachmentList } from './attachment-list'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

type ReportWithRelations = TaskReport & {
  task?: { title?: string }
  submitted_by_profile?: { full_name?: string }
}

export function ReportReviewCard({ report }: { report: ReportWithRelations }) {
  const { data: currentUser } = useCurrentUser()
  const approveReport = useApproveReport()
  const rejectReport = useRejectReport()

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApprove = () => {
    if (!currentUser) return
    approveReport.mutate({ id: report.id, reviewerId: currentUser.id })
  }

  const handleReject = () => {
    if (!currentUser || !rejectionReason.trim()) return
    rejectReport.mutate(
      { id: report.id, reviewerId: currentUser.id, reason: rejectionReason },
      { onSuccess: () => setRejectDialogOpen(false) }
    )
  }

  const isPending = report.status === 'submitted'

  return (
    <div className="rounded-lg border bg-background p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{report.task?.title ?? 'Task'}</h3>
          <p className="text-sm text-muted-foreground">
            Submitted by {report.submitted_by_profile?.full_name} •{' '}
            {format(new Date(report.created_at), 'PPP')}
          </p>
        </div>

        <Badge
          variant="secondary"
          className={
            report.status === 'approved'
              ? 'bg-emerald-100 text-emerald-700'
              : report.status === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-purple-100 text-purple-700'
          }
        >
          {report.status === 'submitted' ? (
            <Clock className="mr-1 h-3 w-3" />
          ) : report.status === 'approved' ? (
            <CheckCircle className="mr-1 h-3 w-3" />
          ) : (
            <XCircle className="mr-1 h-3 w-3" />
          )}
          {report.status}
        </Badge>
      </div>

      <Separator className="my-3" />

      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-muted-foreground">Summary</p>
          <p>{report.summary}</p>
        </div>

        {report.description && (
          <div>
            <p className="font-medium text-muted-foreground">Description</p>
            <p>{report.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {report.time_taken && (
            <div>
              <p className="font-medium text-muted-foreground">Time Taken</p>
              <p>{report.time_taken}</p>
            </div>
          )}
        </div>

        {report.challenges_faced && (
          <div>
            <p className="font-medium text-muted-foreground">Challenges Faced</p>
            <p>{report.challenges_faced}</p>
          </div>
        )}

        {report.outcome && (
          <div>
            <p className="font-medium text-muted-foreground">Outcome</p>
            <p>{report.outcome}</p>
          </div>
        )}

        {report.rejection_reason && (
          <div className="rounded-md bg-red-50 p-3 dark:bg-red-950/30">
            <p className="font-medium text-red-700 dark:text-red-400">Rejection Reason</p>
            <p className="text-red-700 dark:text-red-400">{report.rejection_reason}</p>
          </div>
        )}

        <AttachmentList reportId={report.id} />
      </div>

      {isPending && (
        <>
          <Separator className="my-3" />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleApprove} disabled={approveReport.isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setRejectDialogOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        </>
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please provide a reason for rejecting this report. The user will see this and can resubmit.
            </p>
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || rejectReport.isPending}
            >
              Reject Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}