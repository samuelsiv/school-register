

"use client"

import {ArrowLeftIcon, ArrowRightIcon, TrendingUp} from "lucide-react"

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
import AverageCard from "@/components/cards/AverageCard";
import {useState} from "react";
import GradeCard from "@/components/cards/GradeCard";


// last in list has to be the current one
export function AveragesOverviewCard({generalAverageByDays, averagesBySubject}: {generalAverageByDays: {grade: number, day: string}[], averagesBySubject: {grade: number, name: string, teacher: string, id: number, grades: {grade: number, name: string, id: number, date: string}[]}[]}) {
    const [selectedAverage, setSelectedAverage] = useState<{grade: number, name: string, teacher: string, id: number, grades: {grade: number, name: string, id: number, date: string}[]} | null>(null)

    return (
        <Card>
            <CardHeader>
                { (selectedAverage == null) && <>
                <CardTitle>Averages</CardTitle>
                <h2 className="text-2xl font-bold">{generalAverageByDays.at(-1)?.grade || "/"}</h2>
                <CardDescription>
                    The average for the last 14 active school days
                </CardDescription>
                </> }
                { (selectedAverage != null) && <>
                    <ArrowLeftIcon onClick={() => {
                        setSelectedAverage(null)
                    }}/>
                    <CardTitle>{selectedAverage.name}</CardTitle>
                    <CardDescription>{selectedAverage.teacher}</CardDescription>
                    <Gauge color={
                        (selectedAverage.grade >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                            (selectedAverage.grade >= 5)  ? "text-[hsla(40,51%,44%,1)]" :
                                "text-[hsla(0,51%,44%,1)]"
                    } value={selectedAverage.grade}
                           size={"medium"} showValue={true}/>
                </>}
            </CardHeader>
            <CardContent>
                {(selectedAverage == null) && <>
                    <GradesChart grades={generalAverageByDays}/>
                    <h2 className="text-xl font-semibold my-6">Subjects</h2>

                    {averagesBySubject.map((average) =>
                        <AverageCard average={average} onArrowClick={() => {setSelectedAverage(average)}}/>
                    )}
                    </>
                }
                { (selectedAverage != null) && <>
                    {selectedAverage.grades.map((grade) =>
                        <GradeCard grade={grade}/>
                    )}
                </>
                }
            </CardContent>
        </Card>
    )
}
