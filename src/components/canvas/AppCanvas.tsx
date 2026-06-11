import { useCallback, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react'
import {
  ReactFlow,
  MarkerType,
  type ReactFlowInstance,
  type OnNodesDelete,
  type Node,
  type Edge,
} from '@xyflow/react'
import type { ServiceNodeData } from '@/types'
import '@xyflow/react/dist/style.css'
import { AlertCircle } from 'lucide-react'
import { ServiceNode, DbNode } from './ServiceNode'
import { CanvasControls } from './CanvasControls'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useAppGraph } from '@/hooks/useAppGraph'
import { useStore } from '@/store/useStore'
import { useFlow } from '@/context/FlowContext'
import { applyRailFilter, isNodeVisibleInView } from '@/lib/railFilters'

const nodeTypes = {
  serviceNode: ServiceNode,
  dbNode: DbNode,
}

const edgeOptions = {
  type: 'smoothstep' as const,
  style: { stroke: 'rgba(79,110,247,0.4)', strokeWidth: 1.5 },
  animated: false,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#4f6ef7',
    width: 12,
    height: 12,
  },
}

export interface AppCanvasHandle {
  fitView: () => void
  addNode: () => void
}

interface AppCanvasProps {
  appId: string | null
}

export const AppCanvas = forwardRef<AppCanvasHandle, AppCanvasProps>(function AppCanvas(
  { appId },
  ref,
) {
  const { data, isLoading, isError, refetch, isFetching } = useAppGraph(appId)
  const selectedNodeId = useStore((s) => s.selectedNodeId)
  const activeRailView = useStore((s) => s.activeRailView)
  const setSelectedNode = useStore((s) => s.setSelectedNode)
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, addNode } =
    useFlow()

  const { nodes: displayNodes, edges: displayEdges } = useMemo(
    () => applyRailFilter(nodes, edges, activeRailView),
    [nodes, edges, activeRailView],
  )

  useEffect(() => {
    if (data) {
      setNodes(data.nodes)
      setEdges(data.edges)
      setSelectedNode(null)

      const id = window.setTimeout(() => {
        const instance = (
          window as Window & {
            __reactFlow?: ReactFlowInstance<Node<ServiceNodeData>, Edge>
          }
        ).__reactFlow
        if (!instance) return

        const view = useStore.getState().activeRailView
        const { nodes: filteredNodes } = applyRailFilter(data.nodes, data.edges, view)
        const visibleNodes = filteredNodes.filter((node) => !node.hidden)
        instance.fitView({
          nodes: visibleNodes.length > 0 ? visibleNodes : undefined,
          padding: 0.2,
          duration: 600,
        })
      }, 0)

      return () => window.clearTimeout(id)
    }
  }, [data, setNodes, setEdges, setSelectedNode])

  useEffect(() => {
    const instance = (
      window as Window & {
        __reactFlow?: ReactFlowInstance<Node<ServiceNodeData>, Edge>
      }
    ).__reactFlow
    if (!instance || nodes.length === 0) return

    const { nodes: filteredNodes } = applyRailFilter(nodes, edges, activeRailView)
    const visibleNodes = filteredNodes.filter((node) => !node.hidden)
    instance.fitView({
      nodes: visibleNodes.length > 0 ? visibleNodes : undefined,
      padding: 0.2,
      duration: 600,
    })
  }, [activeRailView])

  useEffect(() => {
    if (!selectedNodeId) return
    const selectedNode = nodes.find((node) => node.id === selectedNodeId)
    if (selectedNode && !isNodeVisibleInView(selectedNode, activeRailView)) {
      setSelectedNode(null)
    }
  }, [activeRailView, nodes, selectedNodeId, setSelectedNode])

  const fitView = useCallback(() => {
    const instance = (
      window as Window & {
        __reactFlow?: ReactFlowInstance<Node<ServiceNodeData>, Edge>
      }
    ).__reactFlow
    instance?.fitView({ padding: 0.2, duration: 600 })
  }, [])

  const handleAddNode = useCallback(() => {
    const id = addNode()
    setSelectedNode(id)
  }, [addNode, setSelectedNode])

  useImperativeHandle(
    ref,
    () => ({
      fitView,
      addNode: handleAddNode,
    }),
    [fitView, handleAddNode],
  )

  const onInit = useCallback(
    (instance: ReactFlowInstance<Node<ServiceNodeData>, Edge>) => {
      ;(
        window as Window & {
          __reactFlow?: ReactFlowInstance<Node<ServiceNodeData>, Edge>
        }
      ).__reactFlow = instance
      instance.fitView({ padding: 0.2, duration: 600 })
    },
    [],
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNode(node.id)
    },
    [setSelectedNode],
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted) => {
      if (deleted.some((n) => n.id === selectedNodeId)) {
        setSelectedNode(null)
      }
    },
    [selectedNodeId, setSelectedNode],
  )

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="canvas-area relative h-full w-full">
        <Skeleton className="absolute left-[80px] top-[60px] h-[180px] w-[260px]" />
        <Skeleton className="absolute left-[420px] top-[30px] h-[180px] w-[260px]" />
        <Skeleton className="absolute left-[240px] top-[280px] h-[180px] w-[260px]" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="canvas-area flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-[rgba(255,77,106,0.3)] bg-[var(--accent-red-dim)] px-6 py-4 text-[var(--accent-red)]">
          <AlertCircle className="h-6 w-6" />
          <p className="text-[13px] font-medium">Failed to load application graph</p>
          <Button
            variant="outline"
            size="sm"
            className="border-[rgba(255,77,106,0.3)] text-[var(--accent-red)] hover:bg-[rgba(255,77,106,0.1)]"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="canvas-area relative h-full w-full">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDelete={onNodesDelete}
        onInit={onInit}
        deleteKeyCode={['Delete', 'Backspace']}
        defaultEdgeOptions={edgeOptions}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasControls />
      </ReactFlow>
    </div>
  )
})
