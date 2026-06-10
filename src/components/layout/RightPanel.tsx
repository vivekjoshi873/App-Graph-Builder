import { Plus } from 'lucide-react'
import { AppList } from '@/components/apps/AppList'
import { NodeInspector } from '@/components/inspector/NodeInspector'
import { Button } from '@/components/ui/button'

interface RightPanelProps {
  onAddNode?: () => void
}

export function RightPanel({ onAddNode }: RightPanelProps) {
  return (
    <aside className="app-layout__rightpanel flex h-full flex-col overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="shrink-0">
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Applications
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAddNode}
            aria-label="Add application"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <AppList compact />
        <div className="mx-4 my-2 h-px bg-[var(--border-subtle)]" />
      </div>
      <NodeInspector />
    </aside>
  )
}
