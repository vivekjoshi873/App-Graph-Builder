import { Sheet, SheetContent } from '@/components/ui/sheet'
import { RightPanel } from './RightPanel'
import { useStore } from '@/store/useStore'

interface MobileDrawerProps {
  onAddNode?: () => void
}

export function MobileDrawer({ onAddNode }: MobileDrawerProps) {
  const isOpen = useStore((s) => s.isMobilePanelOpen)
  const setOpen = useStore((s) => s.setMobilePanelOpen)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="p-0">
        <RightPanel onAddNode={onAddNode} />
      </SheetContent>
    </Sheet>
  )
}
