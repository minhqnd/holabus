import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  height?: string
  width?: string
  borderRadius?: string
  backgroundColor?: string
  borderColor?: string
  fontSize?: string
  padding?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, height, width, borderRadius, backgroundColor, borderColor, fontSize, padding, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        style={{
          height: height || "2.5rem",
          width: width || "100%",
          borderRadius: borderRadius || "0.375rem",
          backgroundColor: backgroundColor || "transparent",
          borderColor: borderColor || "inherit",
          fontSize: fontSize || "0.875rem",
          padding: padding || "0.5rem 0.75rem"
        }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
