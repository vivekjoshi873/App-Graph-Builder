import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'

const SHORTCUTS = [
  { keys: 'Esc', action: 'Deselect node' },
  { keys: 'F', action: 'Fit graph to view' },
  { keys: '⌘/Ctrl + Shift + F', action: 'Fit graph to view' },
  { keys: 'Delete / Backspace', action: 'Delete selected node' },
  { keys: '⌘/Ctrl + K', action: 'Focus app list' },
]

export function SettingsPanel() {
  const isOpen = useStore((s) => s.isSettingsOpen)
  const setOpen = useStore((s) => s.setSettingsOpen)
  const setActiveRailView = useStore((s) => s.setActiveRailView)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="left-0 right-auto w-[280px] border-l-0 border-r border-[var(--border-subtle)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
        <div className="flex flex-col gap-6 pr-8 pt-2">
          <div>
            <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Settings</h2>
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              App Graph Builder preferences
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Canvas
            </span>
            <Button
              variant="outline"
              size="sm"
              className="justify-start border-[var(--border-default)] text-[var(--text-secondary)]"
              onClick={() => {
                setActiveRailView('graph')
                setOpen(false)
              }}
            >
              Reset to full graph view
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Keyboard shortcuts
            </span>
            <ul className="flex flex-col gap-2">
              {SHORTCUTS.map(({ keys, action }) => (
                <li
                  key={keys}
                  className="flex items-center justify-between gap-3 text-[12px]"
                >
                  <span className="text-[var(--text-secondary)]">{action}</span>
                  <kbd className="shrink-0 rounded border border-[var(--border-default)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                    {keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
            <p className="text-[12px] text-[var(--text-secondary)]">
              Left rail filters the canvas: Databases, Services, Deployments, and
              Layers each show a different slice of the infrastructure graph.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
