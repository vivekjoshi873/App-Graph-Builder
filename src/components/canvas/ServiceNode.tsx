import { memo, useCallback } from 'react'
import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import {
  AlertTriangle,
  CheckCircle,
  Cog,
  Database,
  Leaf,
  Server,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ServiceNodeData } from '@/types'

const SERVICE_ICONS: Record<string, { bg: string; content: React.ReactNode }> = {
  Postgres: { bg: '#336791', content: <span className="text-[10px] font-bold text-white">PG</span> },
  Redis: { bg: '#dc382d', content: <Server className="h-4 w-4 text-white" /> },
  MongoDB: { bg: '#13aa52', content: <Leaf className="h-4 w-4 text-white" /> },
  MySQL: { bg: '#4479a1', content: <span className="text-[10px] font-bold text-white">My</span> },
  RabbitMQ: { bg: '#ff6600', content: <Server className="h-4 w-4 text-white" /> },
  'App Server': { bg: '#4f6ef7', content: <Server className="h-4 w-4 text-white" /> },
  'New Service': { bg: '#9b6dff', content: <Server className="h-4 w-4 text-white" /> },
}

function getServiceIcon(label: string, isDb: boolean) {
  if (isDb) {
    return { bg: '#336791', content: <Database className="h-4 w-4 text-white" /> }
  }
  return SERVICE_ICONS[label] ?? SERVICE_ICONS['App Server']
}

function StatusBadge({ status }: { status: ServiceNodeData['status'] }) {
  if (status === 'healthy') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(0,232,122,0.3)] bg-[var(--accent-green-dim)] px-2 py-[3px] text-[11px] text-[var(--accent-green)]">
        <CheckCircle className="h-3 w-3" />
        Healthy
      </span>
    )
  }
  if (status === 'down') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(255,77,106,0.3)] bg-[var(--accent-red-dim)] px-2 py-[3px] text-[11px] text-[var(--accent-red)]">
        <AlertTriangle className="h-3 w-3" />
        Error
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.1)] px-2 py-[3px] text-[11px] text-[var(--accent-yellow)]">
      <AlertTriangle className="h-3 w-3" />
      Degraded
    </span>
  )
}

function AwsLogo() {
  return (
    <div className="flex items-center opacity-70" style={{ fontSize: '14px' }}>
      <span className="font-bold text-white">aws</span>
      <svg viewBox="0 0 24 12" className="ml-0.5 h-3 w-6" fill="#ff9900">
        <path d="M6 8.5c3.5 2.5 9 2.5 12.5 0 .2-.15.05-.4-.15-.3-3.5 1.5-8 1.5-12 0-.2-.1-.35.15-.35.3z" />
        <path d="M7 6.5c2.8 2 7.2 2 10 0 .15-.1.05-.3-.1-.25-2.8 1.2-6.2 1.2-9.5 0-.15-.05-.25.15-.1.25z" />
      </svg>
    </div>
  )
}

type ServiceNodeProps = NodeProps & {
  data: ServiceNodeData
  type?: string
}

function ServiceNodeComponent({ id, data, selected, type }: ServiceNodeProps) {
  const { setNodes } = useReactFlow()
  const isDb = type === 'dbNode' || data.nodeCategory === 'database'
  const icon = getServiceIcon(data.label, isDb)
  const tabs: ServiceNodeData['activeTab'][] = ['cpu', 'memory', 'disk', 'region']

  const handleTabChange = useCallback(
    (tab: ServiceNodeData['activeTab']) => {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, activeTab: tab } } : n,
        ),
      )
    },
    [id, setNodes],
  )

  const sliderValue =
    data.activeTab === 'cpu'
      ? data.cpuLimit
      : data.activeTab === 'memory'
        ? Math.round(data.metrics.memory * 100)
        : data.activeTab === 'disk'
          ? Math.round(data.metrics.disk * 5)
          : 75

  return (
    <div
      className={cn(
        'service-node-card',
        selected && 'selected',
        isDb && 'db-node-card',
      )}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ background: icon.bg }}
        >
          {icon.content}
        </div>
        <span className="flex-1 text-[14px] font-semibold text-[var(--text-primary)]">
          {data.label}
        </span>
        <span className="rounded-md border border-[rgba(0,232,122,0.25)] bg-[var(--accent-green-dim)] px-[7px] py-0.5 text-[11px] font-semibold text-[var(--accent-green)]">
          {data.cost}
        </span>
        <Cog className="h-3.5 w-3.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]" />
      </div>

      <div className="mb-2.5 flex justify-between">
        {['0.02', '0.05 GB', '10.00 GB', '1'].map((stat) => (
          <span key={stat} className="text-center text-[11px] text-[var(--text-secondary)]">
            {stat}
          </span>
        ))}
      </div>

      <div className="mb-2.5 flex rounded-lg bg-[var(--bg-base)] p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleTabChange(tab)
            }}
            className={cn(
              'flex-1 rounded-md py-1 text-center text-[11px] capitalize transition-colors',
              data.activeTab === tab
                ? 'bg-white/10 font-medium text-[var(--text-primary)]'
                : 'text-[var(--text-muted)]',
            )}
          >
            {tab === 'cpu' ? 'CPU' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="relative h-[5px] flex-1 overflow-hidden rounded-[3px] bg-[var(--bg-base)]">
          <div
            className="absolute inset-y-0 left-0 rounded-[3px]"
            style={{
              width: `${sliderValue}%`,
              background:
                'linear-gradient(90deg, #4f6ef7 0%, #00b4d8 30%, #00e87a 60%, #f5a623 80%, #ff4d6a 100%)',
            }}
          />
        </div>
        <span className="min-w-[36px] text-right text-[12px] text-[var(--text-secondary)]">
          {sliderValue}%
        </span>
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge status={data.status} />
        <AwsLogo />
      </div>
    </div>
  )
}

export const ServiceNode = memo(ServiceNodeComponent)
export const DbNode = memo(ServiceNodeComponent)
