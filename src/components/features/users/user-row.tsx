'use client'

import { Profile } from '@/types'
import { useUserTaskStats, useChangeUserRole, useToggleUserActive } from '@/hooks/use-users'
import { useCurrentUser } from '@/hooks/use-current-user'
import { TableCell, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'



export function UserRow({ user }: { user: Profile }) {
  const { data: currentUser } = useCurrentUser()
  const { data: stats, isLoading: statsLoading } = useUserTaskStats(user.id)
  const changeRole = useChangeUserRole()
  const toggleActive = useToggleUserActive()

  const isSelf = currentUser?.id === user.id
  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Link href={`/admin/analytics/${user.id}`} className="flex items-center gap-3 hover:underline">
         <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        </Link> 
      </TableCell>

      <TableCell>
        {statsLoading ? <Skeleton className="h-4 w-12" /> : stats?.total ?? 0}
      </TableCell>

      <TableCell>
        {statsLoading ? <Skeleton className="h-4 w-12" /> : `${stats?.completionRate ?? 0}%`}
      </TableCell>

      <TableCell>
        <Badge variant={user.is_active ? 'secondary' : 'outline'} className={user.is_active ? 'bg-green-100 text-green-700' : 'text-muted-foreground'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          disabled={isSelf || toggleActive.isPending}
          onClick={() => toggleActive.mutate({ id: user.id, activate: !user.is_active })}
        >
          {user.is_active ? 'Deactivate' : 'Activate'}
        </Button>
      </TableCell>
    </TableRow>
  )
}