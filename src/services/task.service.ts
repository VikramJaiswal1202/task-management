import { createClient } from '@/lib/supabase/client'
import { Task, TaskInsert, TaskUpdate, TaskWithProfiles } from '@/types'

export interface TaskFilters {
  status?: string
  priority?: string
  assignedTo?: string
  search?: string
  sortBy?: 'newest' | 'oldest' | 'deadline' | 'priority' | 'alphabetical'
}

export const taskService = {
  async getTasks(userId: string, role: string, filters: TaskFilters = {}): Promise<TaskWithProfiles[]> {
    const supabase = createClient()

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_profile:profiles!tasks_assigned_to_fkey(*),
        created_by_profile:profiles!tasks_created_by_fkey(*)
      `)

    if (role !== 'admin') {
      query = query.or(`assigned_to.eq.${userId},created_by.eq.${userId}`)
    }

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority)
    }
    if (filters.assignedTo && filters.assignedTo !== 'all') {
      query = query.eq('assigned_to', filters.assignedTo)
    }

    if (filters.search) {
      // Find users whose name/email matches, so we can also match tasks assigned to them
      const { data: matchingUsers } = await supabase
        .from('profiles')
        .select('id')
        .or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)

      const userIds = matchingUsers?.map((u) => u.id) ?? []
      const userFilter = userIds.length > 0 ? `,assigned_to.in.(${userIds.join(',')})` : ''

      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%${userFilter}`
      )
    }

    switch (filters.sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'deadline':
        query = query.order('deadline', { ascending: true })
        break
      case 'alphabetical':
        query = query.order('title', { ascending: true })
        break
      case 'priority':
        query = query.order('priority', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw error
    return data as unknown as TaskWithProfiles[]
  },

  async getTaskById(id: string): Promise<TaskWithProfiles> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_profile:profiles!tasks_assigned_to_fkey(*),
        created_by_profile:profiles!tasks_created_by_fkey(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as unknown as TaskWithProfiles
  },

  async createTask(task: TaskInsert): Promise<Task> {
    const supabase = createClient()
    const { data, error } = await supabase.from('tasks').insert(task).select().single()
    if (error) throw error
    return data
  },

  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteTask(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  },

  async markComplete(id: string): Promise<Task> {
    return this.updateTask(id, { status: 'completed' })
  },

  async lockTask(id: string): Promise<Task> {
    return this.updateTask(id, { locked: true, status: 'locked' })
  },

  async unlockTask(id: string): Promise<Task> {
    return this.updateTask(id, { locked: false, status: 'pending' })
  },

  async reassignTask(id: string, newAssigneeId: string): Promise<Task> {
    return this.updateTask(id, { assigned_to: newAssigneeId })
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('tasks').update({ status }).in('id', ids)
    if (error) throw error
  },

  async bulkDelete(ids: string[]): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('tasks').delete().in('id', ids)
    if (error) throw error
  },

  async bulkLock(ids: string[], locked: boolean): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('tasks').update({ locked }).in('id', ids)
    if (error) throw error
  },
  async getUpcomingDeadlines(limit = 5): Promise<TaskWithProfiles[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select(`*, assigned_to_profile:profiles!tasks_assigned_to_fkey(*)`)
      .not('status', 'in', '(completed,approved,locked)')
      .gte('deadline', new Date().toISOString())
      .order('deadline', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data as unknown as TaskWithProfiles[]
  },

  async getRecentTasks(limit = 5): Promise<TaskWithProfiles[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select(`*, assigned_to_profile:profiles!tasks_assigned_to_fkey(*)`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as unknown as TaskWithProfiles[]
  },
  async getTasksForCalendar(userId: string, role: string): Promise<TaskWithProfiles[]> {
    const supabase = createClient()

    let query = supabase
      .from('tasks')
      .select(`*, assigned_to_profile:profiles!tasks_assigned_to_fkey(*)`)

    if (role !== 'admin') {
      query = query.or(`assigned_to.eq.${userId},created_by.eq.${userId}`)
    }

    const { data, error } = await query
    if (error) throw error
    return data as unknown as TaskWithProfiles[]
  },
}
