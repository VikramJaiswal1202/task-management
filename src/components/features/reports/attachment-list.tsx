'use client'

import { useQuery } from '@tanstack/react-query'
import { attachmentService } from '@/services/attachment.service'
import { storageService } from '@/services/storage.service'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AttachmentList({ reportId }: { reportId: string }) {
  const { data: attachments } = useQuery({
    queryKey: ['attachments', reportId],
    queryFn: () => attachmentService.getAttachmentsByReport(reportId),
  })

  if (!attachments || attachments.length === 0) return null

  const handleDownload = async (path: string, fileName: string) => {
    const url = await storageService.getSignedUrl(path)
    window.open(url, '_blank')
  }

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-muted-foreground">Attachments</p>
      <div className="space-y-1">
        {attachments.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            <div className="flex items-center gap-2 truncate">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{a.file_name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleDownload(a.file_path, a.file_name)}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}