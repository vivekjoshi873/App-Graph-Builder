import { useRef, useState, useEffect } from 'react'
import {
  ChevronDown,
  Maximize2,
  PanelRight,
  PlusCircle,
  Share2,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApps } from '@/hooks/useApps'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

interface TopBarProps {
  onFitView: () => void
  onAddNode: () => void
  isMobile?: boolean
  onOpenPanel?: () => void
}

export function TopBar({
  onFitView,
  onAddNode,
  isMobile = false,
  onOpenPanel,
}: TopBarProps) {
  const { data: apps } = useApps()
  const selectedAppId = useStore((s) => s.selectedAppId)
  const setSelectedApp = useStore((s) => s.setSelectedApp)
  const setAppListOpen = useStore((s) => s.setAppListOpen)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedApp = apps?.find((a) => a.id === selectedAppId)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as HTMLElement)) {
        setDropdownOpen(false)
        setAppListOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setAppListOpen])

  useEffect(() => {
    setAppListOpen(dropdownOpen)
  }, [dropdownOpen, setAppListOpen])

  return (
    <header className="app-layout__topbar flex h-[52px] items-center justify-between overflow-visible border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 backdrop-blur-[12px]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-blue)]">
          <Zap className="h-4 w-4 text-white" />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border-default)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)]"
          >
            {selectedApp?.name ?? 'Select app'}
            <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-[100] mt-1 w-64 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] py-1 shadow-xl">
              {apps?.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    setSelectedApp(app.id)
                    setDropdownOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.06]',
                    app.id === selectedAppId && 'bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]',
                  )}
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white"
                    style={{ background: app.color }}
                  >
                    {app.icon.slice(0, 2).toUpperCase()}
                  </div>
                  {app.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isMobile ? (
        <Button variant="ghost" size="icon" onClick={onOpenPanel} aria-label="Open panel">
          <PanelRight className="h-4 w-4" />
        </Button>
      ) : (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onAddNode} aria-label="Add node">
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onFitView} aria-label="Fit view">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-5 w-px bg-[var(--border-subtle)]" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-blue)] text-[11px] font-semibold text-white">
            AG
          </div>
        </div>
      )}
    </header>
  )
}
