"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Type fixes pour Recharts v3
type ChartConfig = Record<string, {
  label?: string
  color?: string
  icon?: React.ComponentType
}>

const ChartContext = React.createContext<ChartConfig | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={config}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<any, any>(
// using 'any' for props to avoid Recharts type incompatibilities
  (
    {
      active,
      payload: payloadProp,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label: labelProp,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const config = useChart()

    // Type assertion pour éviter erreurs TS
    const payload = (payloadProp || []) as any[]
    const label = labelProp as any

    if (!active || !payload?.length) {
      return null
    }

    const item = payload[0]
    const key = `${nameKey || item?.name || item?.dataKey || "value"}`
    const itemConfig = config[key] || {}

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter ? labelFormatter(label, payload) : label}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = config[key] || {}
            const value = formatter
              ? formatter(item.value, item.name, item, index, payload)
              : item.value

            return (
              <div
                key={item.dataKey}
                className="flex w-full items-center gap-2"
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-[2px]",
                      indicator === "dot" && "rounded-full",
                      indicator === "dashed" && "border-[1.5px] border-dashed"
                    )}
                    style={{
                      backgroundColor: item.color || itemConfig.color,
                      borderColor: item.color || itemConfig.color,
                    }}
                  />
                )}
                <div className="flex flex-1 justify-between gap-2">
                  <span className="text-muted-foreground">
                    {itemConfig.label || item.name}
                  </span>
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<any, any>(
// using 'any' for props to avoid Recharts type incompatibilities
  (
    { className, hideIcon = false, payload: payloadProp, verticalAlign = "bottom", nameKey }: any,
    ref: any
  ) => {
    const config = useChart()

    // Type assertion
    const payload = (payloadProp || []) as any[]

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item: any) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = config[key] || {}

          return (
            <div
              key={item.value}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            >
              {itemConfig.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color || itemConfig.color,
                  }}
                />
              )}
              <span className="text-muted-foreground">
                {itemConfig.label || item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
