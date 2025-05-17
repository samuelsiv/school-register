

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

import {GradesChart} from "@/components/charts/GradesChart";
import {Grade} from "@/types/grade";


// last in list has to be the current one
export function DashboardAverageCard({grades}: {grades: Grade[]}) {
    return (
        <Card className="border-t border-t-[2px]">
            <CardHeader>
                <CardTitle>Grade Average</CardTitle>
                <h2 className="text-2xl font-bold">{grades[0]?.value || "/"}</h2>
                <CardDescription>
                    Last 14 active school days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GradesChart grades={grades} />
            </CardContent>
        </Card>
    )
}
