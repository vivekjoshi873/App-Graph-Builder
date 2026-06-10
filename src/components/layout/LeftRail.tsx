import {
  Database,
  GitBranch,
  Layers,
  LayoutGrid,
  Server,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const RAIL_ITEMS = [
  { icon: LayoutGrid, label: 'Graph', active: true },
  { icon: Database, label: 'Databases' },
  { icon: Server, label: 'Services' },
  { icon: GitBranch, label: 'Deployments' },
  { icon: Layers, label: 'Layers' },
]

export function LeftRail() {
  return (
    <TooltipProvider delayDuration={200}>
      <nav className="app-layout__leftrail flex h-full flex-col items-center gap-1 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] py-3">
        {RAIL_ITEMS.map(({ icon: Icon, label, active }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-md',
                  active
                    ? 'bg-[var(--accent-blue-dim)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue-dim)]'
                    : 'text-[var(--text-secondary)]',
                )}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mt-auto h-8 w-8 rounded-md text-[var(--text-secondary)]"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>

        <div
          className="mb-1 h-2 w-2 rounded-full bg-[var(--accent-green)]"
          title="Online"
        />
      </nav>
    </TooltipProvider>
  )
}
