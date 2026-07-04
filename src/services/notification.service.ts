import { createClient } from '@/lib/supabase/client'
import { Notification } from '@/types'

export const notificationService = {
  async getNotifications(userId: string, limit = 20): Promise<Notification[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  async getUnreadCount(userId: string): Promise<number> {
    const supabase = createClient()
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return count ?? 0
  },

  async markAsRead(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    if (error) throw error
  },

  async markAllAsRead(userId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    if (error) throw error
  },
}