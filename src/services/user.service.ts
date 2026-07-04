import { createClient } from '@/lib/supabase/client'
import { Profile, UserRole } from '@/types'

export const userService = {
  async getUsers(): Promise<Profile[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) throw error
    return data
  },

  async getUserById(id: string): Promise<Profile> {
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async changeUserRole(id: string, role: UserRole): Promise<Profile> {
    return this.updateProfile(id, { role })
  },

  async deactivateUser(id: string): Promise<Profile> {
    return this.updateProfile(id, { is_active: false })
  },

  async activateUser(id: string): Promise<Profile> {
    return this.updateProfile(id, { is_active: true })
  },

  async getUserTaskStats(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('status')
    .or(`assigned_to.eq.${userId},created_by.eq.${userId}`)

  if (error) throw error

  const total = data.length
  const completed = data.filter((t) =>
    ['completed', 'submitted', 'approved'].includes(t.status)
  ).length
  const overdue = data.filter((t) => t.status === 'overdue').length

  return {
    total,
    completed,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
},
  
}