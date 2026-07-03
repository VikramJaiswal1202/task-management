import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  taskFormOpen: boolean
  editingTaskId: string | null
  openTaskForm: (taskId?: string) => void
  closeTaskForm: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      taskFormOpen: false,
      editingTaskId: null,
      openTaskForm: (taskId) => set({ taskFormOpen: true, editingTaskId: taskId ?? null }),
      closeTaskForm: () => set({ taskFormOpen: false, editingTaskId: null }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }), // only persist sidebar state
    }
  )
)