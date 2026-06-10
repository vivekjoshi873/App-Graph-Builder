import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import type { ServiceNodeData } from '@/types'

interface RuntimeTabProps {
  data: ServiceNodeData
}

const METRICS = [
  { key: 'cpu', label: 'CPU Usage', format: (d: ServiceNodeData) => `${(d.metrics.cpu * 100).toFixed(1)}%` },
  { key: 'memory', label: 'Memory', format: (d: ServiceNodeData) => `${d.metrics.memory.toFixed(2)} GB` },
  { key: 'uptime', label: 'Uptime', format: () => '99.97%' },
  { key: 'requests', label: 'Requests/s', format: () => '1,247' },
] as const

export function RuntimeTab({ data }: RuntimeTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {METRICS.map(({ key, label, format }) => (
          <div
            key={key}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3"
          >
            <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
            <p className="mt-1 text-[18px] font-semibold text-[var(--text-primary)]">
              {format(data)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Last Deployed</Label>
        <p className="text-[13px] text-[var(--text-secondary)]">2 hours ago</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Provider</Label>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="gap-1.5 px-2.5 py-1">
            <span className="font-bold text-white">aws</span>
            <svg viewBox="0 0 24 12" className="h-2.5 w-5" fill="#ff9900">
              <path d="M6 8.5c3.5 2.5 9 2.5 12.5 0 .2-.15.05-.4-.15-.3-3.5 1.5-8 1.5-12 0-.2-.1-.35.15-.35.3z" />
            </svg>
          </Badge>
          <span className="text-[13px] text-[var(--text-secondary)]">
            {data.metrics.region}
          </span>
        </div>
      </div>
    </div>
  )
}
