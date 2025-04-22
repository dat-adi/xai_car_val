import * as React from "react"
import { cn } from "@/lib/utils"

interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  indicatorClassName?: string
}

const Bar = React.forwardRef<HTMLDivElement, BarProps>(
  ({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
    const percentage = (value / max) * 100

    return (
      <div
        ref={ref}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  },
)
Bar.displayName = "Bar"

export { Bar }
