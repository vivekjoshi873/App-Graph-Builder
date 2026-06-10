import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { Button } from '@/components/ui/button'

export function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1">
      <Button
        variant="ghost"
        size="iconSm"
        className="h-7 w-7"
        onClick={() => zoomIn({ duration: 200 })}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="iconSm"
        className="h-7 w-7"
        onClick={() => zoomOut({ duration: 200 })}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="iconSm"
        className="h-7 w-7"
        onClick={() => fitView({ padding: 0.2, duration: 600 })}
        aria-label="Fit view"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
