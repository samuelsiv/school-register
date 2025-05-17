"use client"

import {ArrowDown, ArrowLeftIcon, ArrowRightIcon, TrendingUp} from "lucide-react"
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
import {useState} from "react";


// last in list has to be the current one
export function GradesListCard({grades, cols}: {grades: {grade: number, name: string, id: number, date: string, description?: string | null}[], cols?: number | null}) {
    const [selectedGrade, setGrade] = useState<{grade: number, name: string, id: number, date: string, description?: string | null} | null>()
    return (
        <Card className="border-t-[2px]">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Latest Grades</CardTitle>
            </CardHeader>
            <CardContent>
                {(selectedGrade == null) && <div className={`grid grid-cols-${cols || '3'} gap-6`}>
                    {grades.map((grade) =>
                        <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]" key={grade.id} onClick={() => setGrade(grade)}>
                            <h1 className="text-2xl font-bold">{grade.grade}</h1>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <p className="text-xl font-semibold">{grade.name}</p>
                                <p className="text-l font-light">{grade.date}</p>
                                { grade.description &&
                                    <p className="text-m font-light">{grade.description}</p>
                                }
                                {(cols || 3 <= 2) && <ArrowDown/> }
                            </div>
                            {(cols || 3 > 2) && <ArrowRightIcon/> }
                        </Card>
                    )}
                </div> }
                { (selectedGrade != null) && <div className={"flex flex-col gap-6"}>
                    <ArrowLeftIcon onClick={() => {
                        setGrade(null)
                    }}/>
                    <CardTitle>{selectedGrade.name}</CardTitle>
                    <Gauge color={
                        (selectedGrade.grade >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                            (selectedGrade.grade >= 5)  ? "text-[hsla(40,51%,44%,1)]" :
                                "text-[hsla(0,51%,44%,1)]"
                    } value={selectedGrade.grade}
                           size={"medium"} showValue={true}/>
                    <CardDescription>{selectedGrade.description}</CardDescription>
                </div>}

            </CardContent>
        </Card>
    )
}
