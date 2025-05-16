

"use client"

import {ArrowRightIcon, TrendingUp} from "lucide-react"
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
import {Gauge} from "@/components/ui/gauge";


// last in list has to be the current one
export function GradesListCard({grades}: {grades: {grade: number, name: string, id: number, date: string}[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Latest Grades</CardTitle>
            </CardHeader>
            <CardContent>
                {grades.map((grade) =>
                    <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]" key={grade.id}>
                        <h1 className="text-2xl font-bold">{grade.grade}</h1>
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <p className="text-xl font-semibold">{grade.name}</p>
                            <p className="text-m font-light">{grade.date}</p>
                        </div>
                        <ArrowRightIcon/>
                    </Card>
                )}
            </CardContent>
        </Card>
    )
}
