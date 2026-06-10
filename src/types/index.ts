import type { Node, Edge } from '@xyflow/react'

export interface App {
  id: string
  name: string
  color: string
  icon: string
}

export interface ServiceNodeData {
  label: string
  description: string
  status: 'healthy' | 'degraded' | 'down'
  cpuLimit: number
  activeTab: 'cpu' | 'memory' | 'disk' | 'region'
  provider: 'aws' | 'gcp' | 'azure'
  cost: string
  metrics: {
    cpu: number
    memory: number
    disk: number
    region: string
  }
  nodeCategory?: 'service' | 'database'
  [key: string]: unknown
}

export interface GraphData {
  nodes: Node<ServiceNodeData>[]
  edges: Edge[]
}
