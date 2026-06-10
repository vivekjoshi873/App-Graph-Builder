import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors',
  {
    variants: {
      variant: {
        healthy:
          'border-[rgba(0,232,122,0.3)] bg-[var(--accent-green-dim)] text-[var(--accent-green)]',
        degraded:
          'border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.1)] text-[var(--accent-yellow)]',
        down: 'border-[rgba(255,77,106,0.3)] bg-[var(--accent-red-dim)] text-[var(--accent-red)]',
        default:
          'border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
