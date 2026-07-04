import { createClient } from '@/lib/supabase/client'
import { ActivityLog } from '@/types'

export interface LogActivityInput {
  user_id: string
  action: string
  entity_type?: string
  entity_id?: string
  metadata?: Record<string, unknown>
}

export const activityService = {
  async logActivity(input: LogActivityInput): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('activity_logs').insert(input)
    if (error) console.error('Failed to log activity:', error) // never block the UI on logging failures
  },

  async getActivityLogs(filters: { userId?: string; limit?: number } = {}): Promise<ActivityLog[]> {
    const supabase = createClient()
    let query = supabase
      .from('activity_logs')
      .select(`*, user:profiles(*)`)
      .order('created_at', { ascending: false })
      .limit(filters.limit ?? 50)

    if (filters.userId) query = query.eq('user_id', filters.userId)

    const { data, error } = await query
    if (error) throw error
    return data as unknown as ActivityLog[]
  },
}