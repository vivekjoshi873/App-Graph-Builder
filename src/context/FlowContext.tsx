import { createContext, useContext, useCallback, type ReactNode } from 'react'
import {
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react'
import type { ServiceNodeData } from '@/types'

type ServiceNode = Node<ServiceNodeData>

interface FlowContextValue {
  nodes: ServiceNode[]
  edges: Edge[]
  setNodes: ReturnType<typeof useNodesState<ServiceNode>>[1]
  setEdges: ReturnType<typeof useEdgesState<Edge>>[1]
  onNodesChange: OnNodesChange<ServiceNode>
  onEdgesChange: OnEdgesChange<Edge>
  updateNodeData: (nodeId: string, data: Partial<ServiceNodeData>) => void
  updateNodeType: (nodeId: string, nodeType: 'serviceNode' | 'dbNode') => void
  addNode: () => string
}

const FlowContext = createContext<FlowContextValue | null>(null)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<ServiceNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<ServiceNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
        ),
      )
    },
    [setNodes],
  )

  const updateNodeType = useCallback(
    (nodeId: string, nodeType: 'serviceNode' | 'dbNode') => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                type: nodeType,
                data: {
                  ...n.data,
                  nodeCategory: nodeType === 'dbNode' ? 'database' : 'service',
                },
              }
            : n,
        ),
      )
    },
    [setNodes],
  )

  const addNode = useCallback(() => {
    const id = `node-${Date.now()}`
    const newNode: ServiceNode = {
      id,
      type: 'serviceNode',
      position: {
        x: 100 + Math.random() * 400,
        y: 80 + Math.random() * 300,
      },
      data: {
        label: 'New Service',
        description: 'Newly added service node',
        status: 'healthy',
        cpuLimit: 50,
        activeTab: 'cpu',
        provider: 'aws',
        cost: '$0.03/HR',
        metrics: { cpu: 0.02, memory: 0.05, disk: 10.0, region: 'us-east-1' },
        nodeCategory: 'service',
      },
    }
    setNodes((nds) => [...nds, newNode])
    return id
  }, [setNodes])

  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        updateNodeData,
        updateNodeType,
        addNode,
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}
