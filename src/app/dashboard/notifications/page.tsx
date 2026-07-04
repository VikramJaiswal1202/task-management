'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCheck, Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function NotificationsPage() {
  const { data: currentUser } = useCurrentUser()
  const userId = currentUser?.id ?? ''

  const { data: notifications, isLoading } = useNotifications(userId)
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const basePath = currentUser?.profile.role === 'admin' ? '/admin' : '/dashboard'
  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your tasks and reports</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllRead.mutate(userId)}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-background">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Bell className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground">
              You&apos;ll see updates about your tasks and reports here
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.related_task_id ? `${basePath}/tasks/${n.related_task_id}` : basePath}
                onClick={() => !n.is_read && markRead.mutate(n.id)}
                className={cn(
                  'block px-4 py-3 text-sm transition-colors hover:bg-muted/50',
                  !n.is_read && 'bg-primary/5'
                )}
              >
                <div className="flex items-start gap-3">
                  {!n.is_read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  <div className={cn('flex-1', n.is_read && 'ml-3.5')}>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}