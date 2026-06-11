import type { Edge, Node } from '@xyflow/react'
import type { ServiceNodeData } from '@/types'

export type RailView = 'graph' | 'databases' | 'services' | 'deployments' | 'layers'

export const RAIL_VIEWS: { id: RailView; label: string }[] = [
  { id: 'graph', label: 'Graph' },
  { id: 'databases', label: 'Databases' },
  { id: 'services', label: 'Services' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'layers', label: 'Layers' },
]

function isDatabaseNode(node: Node<ServiceNodeData>) {
  return node.type === 'dbNode' || node.data.nodeCategory === 'database'
}

function isDeploymentNode(node: Node<ServiceNodeData>) {
  return node.data.label === 'App Server'
}

export function applyRailFilter(
  nodes: Node<ServiceNodeData>[],
  edges: Edge[],
  view: RailView,
): { nodes: Node<ServiceNodeData>[]; edges: Edge[] } {
  const hiddenNodeIds = new Set<string>()

  switch (view) {
    case 'databases':
      nodes.forEach((node) => {
        if (!isDatabaseNode(node)) hiddenNodeIds.add(node.id)
      })
      break
    case 'services':
      nodes.forEach((node) => {
        if (isDatabaseNode(node)) hiddenNodeIds.add(node.id)
      })
      break
    case 'deployments':
      nodes.forEach((node) => {
        if (!isDeploymentNode(node)) hiddenNodeIds.add(node.id)
      })
      break
    case 'graph':
    case 'layers':
      break
  }

  const filteredNodes = nodes.map((node) => ({
    ...node,
    hidden: hiddenNodeIds.has(node.id),
  }))

  const filteredEdges = edges.map((edge) => ({
    ...edge,
    hidden:
      view === 'layers' ||
      hiddenNodeIds.has(edge.source) ||
      hiddenNodeIds.has(edge.target),
  }))

  return { nodes: filteredNodes, edges: filteredEdges }
}

export function isNodeVisibleInView(node: Node<ServiceNodeData>, view: RailView) {
  if (view === 'graph' || view === 'layers') return true
  if (view === 'databases') return isDatabaseNode(node)
  if (view === 'services') return !isDatabaseNode(node)
  return isDeploymentNode(node)
}
