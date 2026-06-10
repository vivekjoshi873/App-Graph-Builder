import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useFlow } from '@/context/FlowContext'
import type { ServiceNodeData } from '@/types'

interface ConfigTabProps {
  nodeId: string
  data: ServiceNodeData
}

export function ConfigTab({ nodeId, data }: ConfigTabProps) {
  const { updateNodeData, updateNodeType } = useFlow()
  const [cpuLimit, setCpuLimit] = useState(data.cpuLimit)

  const handleCpuLimitChange = (val: number) => {
    const clamped = Math.min(100, Math.max(0, val))
    setCpuLimit(clamped)
    updateNodeData(nodeId, { cpuLimit: clamped })
  }

  const nodeType =
    data.nodeCategory === 'database' ? 'dbNode' : 'serviceNode'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="node-name">Name</Label>
        <Input
          id="node-name"
          value={data.label}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="node-desc">Description</Label>
        <Textarea
          id="node-desc"
          rows={3}
          value={data.description}
          onChange={(e) => updateNodeData(nodeId, { description: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Status</Label>
        <div className="flex gap-1.5">
          {(['healthy', 'degraded', 'down'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => updateNodeData(nodeId, { status })}
              className={cn(
                'flex-1 rounded-full border px-2 py-1.5 text-[12px] font-medium capitalize transition-colors',
                status === 'healthy' &&
                  (data.status === status
                    ? 'border-[rgba(0,232,122,0.4)] bg-[var(--accent-green-dim)] text-[var(--accent-green)]'
                    : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[rgba(0,232,122,0.3)]'),
                status === 'degraded' &&
                  (data.status === status
                    ? 'border-[rgba(245,166,35,0.4)] bg-[rgba(245,166,35,0.1)] text-[var(--accent-yellow)]'
                    : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[rgba(245,166,35,0.3)]'),
                status === 'down' &&
                  (data.status === status
                    ? 'border-[rgba(255,77,106,0.4)] bg-[var(--accent-red-dim)] text-[var(--accent-red)]'
                    : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[rgba(255,77,106,0.3)]'),
              )}
            >
              {status === 'down' ? 'Down' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>CPU Limit</Label>
        <div className="flex items-center gap-3">
          <Slider
            className="gradient-slider flex-1"
            value={[cpuLimit]}
            min={0}
            max={100}
            step={1}
            onValueChange={([val]) => handleCpuLimitChange(val)}
          />
          <Input
            type="number"
            min={0}
            max={100}
            value={cpuLimit}
            onChange={(e) => {
              const num = parseInt(e.target.value, 10)
              handleCpuLimitChange(Number.isNaN(num) ? 0 : num)
            }}
            className="w-[60px] text-right"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Node Type</Label>
        <div className="flex gap-1.5">
          {(
            [
              { value: 'serviceNode' as const, label: 'Service' },
              { value: 'dbNode' as const, label: 'Database' },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateNodeType(nodeId, value)}
              className={cn(
                'flex-1 rounded-full border px-2 py-1.5 text-[12px] font-medium transition-colors',
                nodeType === value
                  ? 'border-[var(--accent-blue)] bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]'
                  : 'border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
