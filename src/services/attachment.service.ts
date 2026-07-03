import { createClient } from '@/lib/supabase/client'
import { Attachment } from '@/types'

export const attachmentService = {
  async createAttachment(input: {
    task_id?: string
    report_id?: string
    uploaded_by: string
    file_name: string
    file_path: string
    file_type: string
    file_size: number
  }): Promise<Attachment> {
    const supabase = createClient()
    const { data, error } = await supabase.from('attachments').insert(input).select().single()
    if (error) throw error
    return data
  },

  async getAttachmentsByReport(reportId: string): Promise<Attachment[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('report_id', reportId)
    if (error) throw error
    return data
  },
}