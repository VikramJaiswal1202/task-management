import { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type TaskReport = Database['public']['Tables']['task_reports']['Row']
export type Attachment = Database['public']['Tables']['attachments']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']

export type UserRole = Database['public']['Enums']['user_role']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type TaskStatus = Database['public']['Enums']['task_status']
export type TaskType = Database['public']['Enums']['task_type']

export type TaskWithProfiles = Task & {
  assigned_to_profile?: Profile | null
  created_by_profile?: Profile | null
}