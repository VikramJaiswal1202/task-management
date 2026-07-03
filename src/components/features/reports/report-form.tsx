'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportSchema, ReportFormInput } from '@/lib/validations/report'
import { useSubmitReport } from '@/hooks/use-reports'
import { useFileUpload } from '@/hooks/use-file-upload'
import { attachmentService } from '@/services/attachment.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Upload, X, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface ReportFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
  userId: string
}

export function ReportForm({ open, onOpenChange, taskId, userId }: ReportFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const submitReport = useSubmitReport()
  const fileUpload = useFileUpload()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportFormInput>({ resolver: zodResolver(reportSchema) })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    setFiles((prev) => [...prev, ...selected])
    e.target.value = '' // allow re-selecting the same file
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ReportFormInput) => {
    setUploading(true)
    try {
      const report = await submitReport.mutateAsync({
        task_id: taskId,
        submitted_by: userId,
        summary: data.summary,
        description: data.description,
        time_taken: data.timeTaken,
        challenges_faced: data.challengesFaced,
        outcome: data.outcome,
        additional_notes: data.additionalNotes,
      })

      // Upload files sequentially and link them to the report
      for (const file of files) {
        const { path } = await fileUpload.mutateAsync({ file, userId })
        await attachmentService.createAttachment({
          report_id: report.id,
          uploaded_by: userId,
          file_name: file.name,
          file_path: path,
          file_type: file.type,
          file_size: file.size,
        })
      }

      reset()
      setFiles([])
      onOpenChange(false)
    } catch (error) {
      // Errors are already toasted by the individual hooks
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" placeholder="Brief summary of what was done" rows={2} {...register('summary')} />
            {errors.summary && <p className="text-sm text-destructive">{errors.summary.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Detailed description..." rows={3} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeTaken">Time Taken</Label>
              <Input id="timeTaken" placeholder="e.g. 3 hours" {...register('timeTaken')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challengesFaced">Challenges Faced</Label>
            <Textarea id="challengesFaced" rows={2} {...register('challengesFaced')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Textarea id="outcome" rows={2} {...register('outcome')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea id="additionalNotes" rows={2} {...register('additionalNotes')} />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-sm text-muted-foreground hover:bg-muted/50"
            >
              <Upload className="mb-2 h-5 w-5" />
              <span>Click to upload PDF, DOCX, or images (max 10MB each)</span>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {files.length > 0 && (
              <div className="space-y-1">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}