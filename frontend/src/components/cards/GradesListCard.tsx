

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
export function GradesListCard({grades}: {grades: {grade: number, name: string, id: number, date: string, description?: string | null}[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Latest Grades</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-6">
                    {grades.map((grade) =>
                        <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]" key={grade.id}>
                            <h1 className="text-2xl font-bold">{grade.grade}</h1>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <p className="text-xl font-semibold">{grade.name}</p>
                                <p className="text-l font-light">{grade.date}</p>
                                { grade.description &&
                                    <p className="text-m font-light">{grade.description}</p>
                                }
                            </div>
                            <ArrowRightIcon/>
                        </Card>
                    )}
                </div>

            </CardContent>
        </Card>
    )
}
