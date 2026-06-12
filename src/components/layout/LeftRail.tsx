import {
  Database,
  GitBranch,
  Layers,
  LayoutGrid,
  Server,
  // Settings,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RAIL_VIEWS, type RailView } from '@/lib/railFilters'
import { useStore } from '@/store/useStore'

const RAIL_ICONS: Record<RailView, LucideIcon> = {
  graph: LayoutGrid,
  databases: Database,
  services: Server,
  deployments: GitBranch,
  layers: Layers,
}

export function LeftRail() {
  const activeRailView = useStore((s) => s.activeRailView)
  const setActiveRailView = useStore((s) => s.setActiveRailView)

  return (
    <nav className="app-layout__leftrail flex h-full flex-col items-center gap-1 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] py-3">
      {RAIL_VIEWS.map(({ id, label }) => {
        const Icon = RAIL_ICONS[id]
        const isActive = activeRailView === id

        return (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-md',
                  isActive
                    ? 'bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue-dim)]'
                    : 'text-[var(--text-secondary)]',
                )}
                aria-label={label}
                aria-pressed={isActive}
                onClick={() => setActiveRailView(id)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        )
      })}

      {/* <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="mt-auto h-8 w-8 rounded-md text-[var(--text-secondary)]"
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Settings</TooltipContent>
      </Tooltip> */}

      {/* <div
        className="mb-1 h-2 w-2 rounded-full bg-[var(--accent-green)]"
        title="Online"
      /> */}
    </nav>
  )
}
