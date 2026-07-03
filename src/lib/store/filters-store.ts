import { create } from 'zustand'
import { TaskStatus, TaskPriority } from '@/types'

interface FiltersState {
  search: string
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  assignedTo: string | 'all'
  sortBy: 'newest' | 'oldest' | 'deadline' | 'priority' | 'alphabetical'

  setSearch: (search: string) => void
  setStatus: (status: TaskStatus | 'all') => void
  setPriority: (priority: TaskPriority | 'all') => void
  setAssignedTo: (assignedTo: string) => void
  setSortBy: (sortBy: FiltersState['sortBy']) => void
  resetFilters: () => void
}

const initialState = {
  search: '',
  status: 'all' as const,
  priority: 'all' as const,
  assignedTo: 'all',
  sortBy: 'newest' as const,
}

export const useFiltersStore = create<FiltersState>()((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setPriority: (priority) => set({ priority }),
  setAssignedTo: (assignedTo) => set({ assignedTo }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(initialState),
}))