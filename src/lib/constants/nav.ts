import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  BarChart3,
  Users,
  Bell,
  Settings,
  FileText,
  ClipboardList,
} from 'lucide-react'

export const userNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { title: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
]
export const adminNavItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'My Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { title: 'All Tasks', href: '/admin/tasks', icon: ListTodo },
  { title: 'Reports', href: '/admin/reports', icon: FileText },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { title: 'Calendar', href: '/admin/calendar', icon: Calendar },
  { title: 'Activity Log', href: '/admin/activity', icon: ClipboardList },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
]