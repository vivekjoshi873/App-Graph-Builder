import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Plus } from 'lucide-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TopBar } from '@/components/layout/TopBar'
import { LeftRail } from '@/components/layout/LeftRail'
import { RightPanel } from '@/components/layout/RightPanel'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { AppCanvas, type AppCanvasHandle } from '@/components/canvas/AppCanvas'
import { FlowProvider } from '@/context/FlowContext'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function Dashboard() {
  const canvasRef = useRef<AppCanvasHandle>(null)
  const selectedAppId = useStore((s) => s.selectedAppId)
  const setSelectedNode = useStore((s) => s.setSelectedNode)
  const setMobilePanelOpen = useStore((s) => s.setMobilePanelOpen)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const fitView = useCallback(() => {
    canvasRef.current?.fitView()
  }, [])

  const addNode = useCallback(() => {
    canvasRef.current?.addNode()
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNode(null)
        return
      }

      if (
        e.key === 'f' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        fitView()
        return
      }

      if (e.key === 'f' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        fitView()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [fitView, setSelectedNode])

  return (
    <div className="app-layout">
      <TopBar
        onFitView={fitView}
        onAddNode={addNode}
        isMobile={isMobile}
        onOpenPanel={() => setMobilePanelOpen(true)}
      />
      <LeftRail />
      <main className="app-layout__canvas relative">
        <AppCanvas ref={canvasRef} appId={selectedAppId} />
        {isMobile && (
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 z-30 h-12 w-12 rounded-full shadow-lg md:hidden"
            onClick={addNode}
            aria-label="Add node"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </main>
      {!isMobile && <RightPanel onAddNode={addNode} />}
      {isMobile && <MobileDrawer onAddNode={addNode} />}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ReactFlowProvider>
          <FlowProvider>
            <Dashboard />
          </FlowProvider>
        </ReactFlowProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
