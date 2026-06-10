import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-[5px] w-full grow overflow-hidden rounded-[3px] bg-[var(--bg-base)]">
      <SliderPrimitive.Range
        className="absolute h-full rounded-[3px]"
        style={{
          background:
            'linear-gradient(90deg, #4f6ef7 0%, #00b4d8 30%, #00e87a 60%, #f5a623 80%, #ff4d6a 100%)',
        }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-[14px] w-[14px] rounded-full border-0 bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.4)] transition-colors focus-visible:outline-none focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-[var(--accent-blue)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
