import { MarkerType, type Node, type Edge } from '@xyflow/react'
import type { App, ServiceNodeData } from '@/types'

export const apps: App[] = [
  { id: 'app-1', name: 'supertokens-golang', color: '#00acd7', icon: 'go' },
  { id: 'app-2', name: 'supertokens-java', color: '#f89820', icon: 'java' },
  { id: 'app-3', name: 'supertokens-python', color: '#3572a5', icon: 'python' },
  { id: 'app-4', name: 'supertokens-ruby', color: '#cc342d', icon: 'ruby' },
  { id: 'app-5', name: 'supertokens-node', color: '#339933', icon: 'node' },
]

const edgeDefaults = {
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

function createNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  overrides: Partial<ServiceNodeData> = {},
  type: 'serviceNode' | 'dbNode' = 'serviceNode',
): Node<ServiceNodeData> {
  const isDb = ['Postgres', 'Redis', 'MongoDB', 'MySQL'].includes(label)
  return {
    id,
    type: isDb && type === 'dbNode' ? 'dbNode' : 'serviceNode',
    position,
    data: {
      label,
      description: `${label} service for application infrastructure`,
      status: 'healthy',
      cpuLimit: 50,
      activeTab: 'cpu',
      provider: 'aws',
      cost: '$0.03/HR',
      metrics: {
        cpu: 0.02,
        memory: 0.05,
        disk: 10.0,
        region: 'us-east-1',
      },
      nodeCategory: isDb ? 'database' : 'service',
      ...overrides,
    },
  }
}

function createEdge(id: string, source: string, target: string): Edge {
  return { id, source, target, ...edgeDefaults }
}

const graphApp1: { nodes: Node<ServiceNodeData>[]; edges: Edge[] } = {
  nodes: [
    createNode('go-api', 'App Server', { x: 240, y: 140 }, {
      description: 'Main Go API gateway handling auth requests',
      status: 'healthy',
      cpuLimit: 65,
      cost: '$0.05/HR',
    }),
    createNode('go-pg', 'Postgres', { x: 80, y: 60 }, {
      status: 'healthy',
      cpuLimit: 40,
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('go-redis', 'Redis', { x: 420, y: 30 }, {
      status: 'healthy',
      cpuLimit: 25,
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('go-mongo', 'MongoDB', { x: 520, y: 280 }, {
      status: 'degraded',
      cpuLimit: 55,
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('go-rmq', 'RabbitMQ', { x: 100, y: 300 }, {
      status: 'healthy',
      cpuLimit: 30,
    }),
  ],
  edges: [
    createEdge('e1', 'go-api', 'go-pg'),
    createEdge('e2', 'go-api', 'go-redis'),
    createEdge('e3', 'go-pg', 'go-mongo'),
    createEdge('e4', 'go-api', 'go-rmq'),
  ],
}

const graphApp2: { nodes: Node<ServiceNodeData>[]; edges: Edge[] } = {
  nodes: [
    createNode('java-api', 'App Server', { x: 300, y: 100 }, {
      description: 'Spring Boot authentication service',
      status: 'healthy',
      cpuLimit: 70,
      cost: '$0.06/HR',
    }),
    createNode('java-pg', 'Postgres', { x: 60, y: 200 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('java-redis', 'Redis', { x: 480, y: 80 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('java-mysql', 'MySQL', { x: 180, y: 340 }, {
      status: 'down',
      cpuLimit: 45,
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('java-rmq', 'RabbitMQ', { x: 440, y: 300 }, {
      status: 'healthy',
    }),
  ],
  edges: [
    createEdge('e5', 'java-api', 'java-pg'),
    createEdge('e6', 'java-api', 'java-redis'),
    createEdge('e7', 'java-api', 'java-mysql'),
    createEdge('e8', 'java-pg', 'java-rmq'),
  ],
}

const graphApp3: { nodes: Node<ServiceNodeData>[]; edges: Edge[] } = {
  nodes: [
    createNode('py-api', 'App Server', { x: 200, y: 50 }, {
      description: 'FastAPI auth middleware',
      status: 'healthy',
      cpuLimit: 55,
    }),
    createNode('py-pg', 'Postgres', { x: 50, y: 250 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('py-redis', 'Redis', { x: 380, y: 180 }, {
      status: 'degraded',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('py-mongo', 'MongoDB', { x: 500, y: 60 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('py-mysql', 'MySQL', { x: 260, y: 310 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
  ],
  edges: [
    createEdge('e9', 'py-api', 'py-pg'),
    createEdge('e10', 'py-api', 'py-redis'),
    createEdge('e11', 'py-api', 'py-mongo'),
    createEdge('e12', 'py-pg', 'py-mysql'),
  ],
}

const graphApp4: { nodes: Node<ServiceNodeData>[]; edges: Edge[] } = {
  nodes: [
    createNode('rb-api', 'App Server', { x: 280, y: 160 }, {
      description: 'Rails authentication engine',
      status: 'healthy',
      cpuLimit: 60,
    }),
    createNode('rb-pg', 'Postgres', { x: 90, y: 40 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('rb-redis', 'Redis', { x: 460, y: 200 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('rb-mongo', 'MongoDB', { x: 120, y: 290 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('rb-rmq', 'RabbitMQ', { x: 400, y: 40 }, {
      status: 'degraded',
    }),
  ],
  edges: [
    createEdge('e13', 'rb-api', 'rb-pg'),
    createEdge('e14', 'rb-api', 'rb-redis'),
    createEdge('e15', 'rb-api', 'rb-mongo'),
    createEdge('e16', 'rb-pg', 'rb-rmq'),
  ],
}

const graphApp5: { nodes: Node<ServiceNodeData>[]; edges: Edge[] } = {
  nodes: [
    createNode('node-api', 'App Server', { x: 220, y: 80 }, {
      description: 'Express.js auth server',
      status: 'healthy',
      cpuLimit: 50,
      cost: '$0.04/HR',
    }),
    createNode('node-pg', 'Postgres', { x: 70, y: 220 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('node-redis', 'Redis', { x: 410, y: 120 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('node-mysql', 'MySQL', { x: 340, y: 290 }, {
      status: 'healthy',
      nodeCategory: 'database',
    }, 'dbNode'),
    createNode('node-mongo', 'MongoDB', { x: 530, y: 240 }, {
      status: 'down',
      nodeCategory: 'database',
    }, 'dbNode'),
  ],
  edges: [
    createEdge('e17', 'node-api', 'node-pg'),
    createEdge('e18', 'node-api', 'node-redis'),
    createEdge('e19', 'node-api', 'node-mysql'),
    createEdge('e20', 'node-pg', 'node-mongo'),
  ],
}

export const graphData: Record<string, { nodes: Node<ServiceNodeData>[]; edges: Edge[] }> = {
  'app-1': graphApp1,
  'app-2': graphApp2,
  'app-3': graphApp3,
  'app-4': graphApp4,
  'app-5': graphApp5,
}
