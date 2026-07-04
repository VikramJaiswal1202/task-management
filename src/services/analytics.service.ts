import { createClient } from '@/lib/supabase/client'

export const analyticsService = {
  async getAdminDashboardStats() {
    const supabase = createClient()

    const [
      { count: totalUsers },
      { count: activeTasks },
      { count: completedTasks },
      { count: lockedTasks },
      { count: overdueTasks },
      { count: pendingReports },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).in('status', ['pending', 'in_progress']),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).in('status', ['completed', 'approved']),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'locked'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'overdue'),
      supabase.from('task_reports').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
    ])

    const { count: totalTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true })

    return {
      totalUsers: totalUsers ?? 0,
      activeTasks: activeTasks ?? 0,
      completedTasks: completedTasks ?? 0,
      lockedTasks: lockedTasks ?? 0,
      overdueTasks: overdueTasks ?? 0,
      pendingReports: pendingReports ?? 0,
      completionRate: totalTasks ? Math.round(((completedTasks ?? 0) / totalTasks) * 100) : 0,
    }
  },

  async getUserDashboardStats(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('status, deadline')
      .or(`assigned_to.eq.${userId},created_by.eq.${userId}`)

    if (error) throw error

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return {
      total: data.length,
      completed: data.filter((t) => t.status === 'completed' || t.status === 'approved').length,
      pending: data.filter((t) => t.status === 'pending' || t.status === 'in_progress').length,
      locked: data.filter((t) => t.status === 'locked').length,
      dueToday: data.filter((t) => {
        const d = new Date(t.deadline)
        return d >= today && d < tomorrow
      }).length,
      upcoming: data.filter((t) => new Date(t.deadline) > tomorrow).length,
    }
  },

  async getTasksByStatus() {
    const supabase = createClient()
    const { data, error } = await supabase.from('tasks').select('status')
    if (error) throw error

    const counts: Record<string, number> = {}
    data.forEach((t) => {
      counts[t.status] = (counts[t.status] ?? 0) + 1
    })
    return Object.entries(counts).map(([status, count]) => ({ status, count }))
  },

  async getTasksByPriority() {
    const supabase = createClient()
    const { data, error } = await supabase.from('tasks').select('priority')
    if (error) throw error

    const counts: Record<string, number> = {}
    data.forEach((t) => {
      counts[t.priority] = (counts[t.priority] ?? 0) + 1
    })
    return Object.entries(counts).map(([priority, count]) => ({ priority, count }))
  },

  async getTasksPerMonth(months = 6) {
    const supabase = createClient()
    const since = new Date()
    since.setMonth(since.getMonth() - months)

    const { data, error } = await supabase
      .from('tasks')
      .select('created_at')
      .gte('created_at', since.toISOString())

    if (error) throw error

    const counts: Record<string, number> = {}
    data.forEach((t) => {
      const month = new Date(t.created_at).toLocaleString('default', { month: 'short', year: '2-digit' })
      counts[month] = (counts[month] ?? 0) + 1
    })
    return Object.entries(counts).map(([month, count]) => ({ month, count }))
  },
  async getUserTasksByStatus(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('status')
      .or(`assigned_to.eq.${userId},created_by.eq.${userId}`)
    if (error) throw error

    const counts: Record<string, number> = {}
    data.forEach((t) => {
      counts[t.status] = (counts[t.status] ?? 0) + 1
    })
    return Object.entries(counts).map(([status, count]) => ({ status, count }))
  },

  async getUserTasksByPriority(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('priority')
      .or(`assigned_to.eq.${userId},created_by.eq.${userId}`)
    if (error) throw error

    const counts: Record<string, number> = {}
    data.forEach((t) => {
      counts[t.priority] = (counts[t.priority] ?? 0) + 1
    })
    return Object.entries(counts).map(([priority, count]) => ({ priority, count }))
  },

  async getUserTasksPerMonth(userId: string, months = 6) {
    const supabase = createClient()
    const since = new Date()
    since.setMonth(since.getMonth() - months)

    const { data, error } = await supabase
      .from('tasks')
      .select('created_at')
      .or(`assigned_to.eq.${userId},created_by.eq.${userId}`)
      .gte('created_at', since.toISOString())

    if (error) throw error

    const counts: Record<string, number> = {}
    data.forEach((t) => {
      const month = new Date(t.created_at).toLocaleString('default', { month: 'short', year: '2-digit' })
      counts[month] = (counts[month] ?? 0) + 1
    })
    return Object.entries(counts).map(([month, count]) => ({ month, count }))
  },

  async getUserAvgCompletionTime(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('created_at, updated_at')
      .or(`assigned_to.eq.${userId},created_by.eq.${userId}`)
      .in('status', ['completed', 'approved'])

    if (error) throw error
    if (data.length === 0) return null

    const totalHours = data.reduce((sum, t) => {
      const diff = new Date(t.updated_at).getTime() - new Date(t.created_at).getTime()
      return sum + diff / (1000 * 60 * 60)
    }, 0)

    return Math.round(totalHours / data.length)
  },
}