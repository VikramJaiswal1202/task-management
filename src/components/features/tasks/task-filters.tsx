'use client'

import { useFiltersStore } from '@/lib/store/filters-store'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

export function TaskFiltersBar() {
  const { search, status, priority, sortBy, setSearch, setStatus, setPriority, setSortBy } =
    useFiltersStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="submitted">Submitted</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="locked">Locked</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="deadline">Deadline</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}