import { create } from 'zustand'
import type { RailView } from '@/lib/railFilters'

interface AppState {
  selectedAppId: string | null
  selectedNodeId: string | null
  isMobilePanelOpen: boolean
  activeInspectorTab: 'config' | 'runtime'
  isAppListOpen: boolean
  activeRailView: RailView
  isSettingsOpen: boolean

  setSelectedApp: (id: string | null) => void
  setSelectedNode: (id: string | null) => void
  toggleMobilePanel: () => void
  setMobilePanelOpen: (open: boolean) => void
  setActiveTab: (tab: 'config' | 'runtime') => void
  setAppListOpen: (open: boolean) => void
  setActiveRailView: (view: RailView) => void
  setSettingsOpen: (open: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  selectedAppId: 'app-1',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  isAppListOpen: false,
  activeRailView: 'graph',
  isSettingsOpen: false,

  setSelectedApp: (id) => set({ selectedAppId: id, selectedNodeId: null }),
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  toggleMobilePanel: () => set((s) => ({ isMobilePanelOpen: !s.isMobilePanelOpen })),
  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  setActiveTab: (tab) => set({ activeInspectorTab: tab }),
  setAppListOpen: (open) => set({ isAppListOpen: open }),
  setActiveRailView: (view) => set({ activeRailView: view }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
}))
