'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { userNavItems, adminNavItems } from '@/lib/constants/nav'
import { Profile } from '@/types'
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Users2 } from 'lucide-react'

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const baseNavItems = profile.role === 'admin' ? adminNavItems : userNavItems
  const navItems = profile.is_team_lead
  ? [
      ...baseNavItems.slice(0, 2),
      { title: 'My Team', href: '/dashboard/team', icon: Users2 },
      ...baseNavItems.slice(2),
    ]
  : baseNavItems

  
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-background transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href={profile.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 font-semibold">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span>TaskFlow</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="border-t p-3">
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Logged in as <span className="font-medium capitalize">{profile.role}</span>
          </div>
        </div>
      )}
    </aside>
  )
}