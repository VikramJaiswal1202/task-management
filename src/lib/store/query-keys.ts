export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },
  reports: {
    all: ['reports'] as const,
    lists: () => [...queryKeys.reports.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.reports.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.reports.all, 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    dashboard: (role: string) => [...queryKeys.analytics.all, 'dashboard', role] as const,
  },
} as const