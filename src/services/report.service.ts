import { createClient } from '@/lib/supabase/client'
import { TaskReport } from '@/types'

export interface ReportInput {
  task_id: string
  submitted_by: string
  summary: string
  description?: string
  time_taken?: string
  challenges_faced?: string
  outcome?: string
  additional_notes?: string
}

export const reportService = {
  async getReports(filters: { status?: string; userId?: string } = {}): Promise<TaskReport[]> {
    const supabase = createClient()
    let query = supabase
      .from('task_reports')
      .select(`*, task:tasks(*), submitted_by_profile:profiles!task_reports_submitted_by_fkey(*)`)
      .order('created_at', { ascending: false })

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.userId) query = query.eq('submitted_by', filters.userId)

    const { data, error } = await query
    if (error) throw error
    return data as unknown as TaskReport[]
  },

  async getReportById(id: string): Promise<TaskReport> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_reports')
      .select(`*, task:tasks(*), submitted_by_profile:profiles!task_reports_submitted_by_fkey(*)`)
      .eq('id', id)
      .single()
    if (error) throw error
    return data as unknown as TaskReport
  },

  async submitReport(report: ReportInput): Promise<TaskReport> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_reports')
      .insert({ ...report, status: 'submitted' })
      .select()
      .single()
    if (error) throw error

    // Move the parent task into submitted state too
    await supabase.from('tasks').update({ status: 'submitted' }).eq('id', report.task_id)

    return data
  },

  async approveReport(id: string, reviewerId: string): Promise<TaskReport> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_reports')
      .update({ status: 'approved', reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    await supabase.from('tasks').update({ status: 'approved' }).eq('id', data.task_id)

    return data
  },

  async rejectReport(id: string, reviewerId: string, reason: string): Promise<TaskReport> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_reports')
      .update({
        status: 'rejected',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    await supabase.from('tasks').update({ status: 'rejected' }).eq('id', data.task_id)

    return data
  },
  async getTeamReports(teamId: string): Promise<TaskReport[]> {
    const supabase = createClient()
    const memberIds = (await supabase.from('profiles').select('id').eq('team_id', teamId)).data?.map(p => p.id) ?? []

    const { data, error } = await supabase
      .from('task_reports')
      .select(`*, task:tasks(*), submitted_by_profile:profiles!task_reports_submitted_by_fkey(*)`)
      .in('submitted_by', memberIds)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as unknown as TaskReport[]
  },  
}