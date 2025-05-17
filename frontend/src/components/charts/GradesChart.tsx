"use client"

import {Gauge, TrendingUp} from "lucide-react"
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {Grade} from "@/types/grade";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

// last in list has to be the current one
export function GradesChart({grades, className}: {grades: Grade[], className?: string}) {
    console.log(grades)
    return (
        <ChartContainer config={chartConfig} className={className}>
            <AreaChart
                accessibilityLayer
                data={grades}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="insertedAt"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                    dataKey="value"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickCount={5}
                    ticks={[2, 4, 6, 8, 10]}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                    <linearGradient id="fillGrade" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="grade"
                    type="natural"
                    fill="url(#fillGrade)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}
