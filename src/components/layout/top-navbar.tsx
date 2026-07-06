'use client'

import { Profile } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Bell, LogOut, Search, Settings, User } from 'lucide-react'
import { logout } from '@/actions/auth'
import Link from 'next/link'
import { NotificationBell } from '@/components/features/notifications/notification-bell'
import { useUIStore } from '@/lib/store/ui-store'
import { ThemeToggle } from './theme-toggle'
import { useQueryClient } from '@tanstack/react-query'


export function TopNavbar({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient()
  const { setCommandPaletteOpen } = useUIStore()
  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div />

      <div className="flex items-center gap-3">
        <Button
  variant="outline"
  size="sm"
  className="hidden gap-2 text-muted-foreground sm:flex"
  onClick={() => setCommandPaletteOpen(true)}
>
  <Search className="h-3.5 w-3.5" />
  Search
  <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>
</Button>
        <ThemeToggle />
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{profile.full_name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{profile.full_name}</span>
                <span className="text-xs font-normal text-muted-foreground">{profile.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={profile.role === 'admin' ? '/admin/settings' : '/dashboard/settings'}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={profile.role === 'admin' ? '/admin/settings' : '/dashboard/settings'}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                queryClient.clear()
                logout()
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
                Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}