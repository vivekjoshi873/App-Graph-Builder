import { useEffect, useRef } from 'react'
import {
  ChevronRight,
  Code2,
  Coffee,
  Gem,
  Hexagon,
  Loader2,
} from 'lucide-react'
import { useApps } from '@/hooks/useApps'
import { useAppGraph } from '@/hooks/useAppGraph'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

const APP_ICONS: Record<string, React.ReactNode> = {
  go: <span className="text-[11px] font-bold text-white">Go</span>,
  java: <Coffee className="h-4 w-4 text-white" />,
  python: <Code2 className="h-4 w-4 text-white" />,
  ruby: <Gem className="h-4 w-4 text-white" />,
  node: <Hexagon className="h-4 w-4 text-white" />,
}

interface AppListProps {
  compact?: boolean
}

export function AppList({ compact = false }: AppListProps) {
  const { data: apps, isLoading } = useApps()
  const selectedAppId = useStore((s) => s.selectedAppId)
  const setSelectedApp = useStore((s) => s.setSelectedApp)
  const listRef = useRef<HTMLDivElement>(null)

  const { isFetching: isGraphFetching } = useAppGraph(selectedAppId)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const firstItem = listRef.current?.querySelector<HTMLButtonElement>('button')
        firstItem?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-[var(--bg-elevated)]" />
        ))}
      </div>
    )
  }

  return (
    <div ref={listRef} className={cn('flex flex-col', compact ? 'p-0' : 'p-4')}>
      {!compact && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Applications
          </span>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {apps?.map((app) => {
          const isSelected = app.id === selectedAppId
          const isLoadingGraph = isSelected && isGraphFetching

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedApp(app.id)}
              className={cn(
                'group flex h-10 w-full items-center gap-2.5 rounded-lg px-2 text-left transition-colors',
                isSelected
                  ? 'bg-[var(--accent-blue-dim)] shadow-[inset_2px_0_0_0_var(--accent-blue)]'
                  : 'hover:bg-white/[0.04]',
              )}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{ background: app.color }}
              >
                {APP_ICONS[app.icon]}
              </div>
              <span className="flex-1 truncate text-[13px] text-[var(--text-primary)]">
                {app.name}
              </span>
              {isLoadingGraph && (
                <Loader2 className="h-2 w-2 animate-spin text-[var(--accent-blue)]" />
              )}
              <ChevronRight className="h-4 w-4 text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )
        })}
      </div>
      {!compact && <div className="my-2 h-px bg-[var(--border-subtle)]" />}
    </div>
  )
}
