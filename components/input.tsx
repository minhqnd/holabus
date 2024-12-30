import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string | number;
  height?: string | number;
  fontSize?: string | number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, width, height, fontSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex border border-input bg-background px-3 py-2 ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          className
        )}
        style={{
          width: width || '100%',
          height: height || '2.5rem',
          fontSize: fontSize || '0.875rem'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

