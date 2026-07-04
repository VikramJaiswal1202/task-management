'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useTasks } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { useUIStore } from '@/lib/store/ui-store'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { StatusBadge } from '@/components/features/tasks/task-badges'
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react'

export function CommandPalette() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const [search, setSearch] = useState('')

  const isAdmin = currentUser?.profile.role === 'admin'
  const basePath = isAdmin ? '/admin' : '/dashboard'

  const { data: tasks } = useTasks(currentUser?.id ?? '', currentUser?.profile.role ?? 'user', {
    search: search.length > 1 ? search : undefined,
  })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  const runCommand = (callback: () => void) => {
    setCommandPaletteOpen(false)
    callback()
  }

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search tasks, or type a command..." value={search} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {tasks && tasks.length > 0 && (
          <>
            <CommandGroup heading="Tasks">
              {tasks.slice(0, 6).map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => runCommand(() => router.push(`${basePath}/tasks/${task.id}`))}
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  <span className="flex-1 truncate">{task.title}</span>
                  <StatusBadge status={task.status} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push(basePath))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push(`${basePath}/tasks`))}>
            <ListTodo className="mr-2 h-4 w-4" />
            {isAdmin ? 'All Tasks' : 'My Tasks'}
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push(`${basePath}/calendar`))}>
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </CommandItem>
          {isAdmin && (
            <>
              <CommandItem onSelect={() => runCommand(() => router.push('/admin/users'))}>
                <Users className="mr-2 h-4 w-4" />
                Users
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/admin/analytics'))}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/admin/reports'))}>
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </CommandItem>
            </>
          )}
          <CommandItem onSelect={() => runCommand(() => router.push(`${basePath}/settings`))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}