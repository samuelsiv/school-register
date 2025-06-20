"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

import {GradesChart} from "@/components/charts/GradesChart";
import {Grade} from "@/types/grade";
import AverageCard from "@/components/cards/grades/AverageCard";
import {useState} from "react";
import AverageExpandedCard from "@/components/cards/grades/AverageExpandedCard";

function timestampToDdMm(timestamp: number): string {
    const date = new Date(timestamp);
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
}

// last in list has to be the current one
export function DashboardAverageCard({average, averages, averagesBySubject}: {
    average: number,
    averages: { date: number; average: number }[],
    averagesBySubject: { average: number, grades: Grade[], subject: string, subjectId: number, teacherId: number, teacher: string }[]
}) {
    const [selectedAverage, setSelectedAverage] = useState<{ average: number, grades: Grade[], subject: string, subjectId: number, teacherId: number, teacher: string } | null>(null)

    return (
        <Card className="border-t-[2px]">
            <CardHeader>
                <CardTitle>Grade Average</CardTitle>
                <h2 className="text-2xl font-bold">{average || "/"}</h2>
                <CardDescription>
                    Last 14 active school days
                </CardDescription>
            </CardHeader>
            <CardContent className="gap-2">
                    { selectedAverage == null && <>
                    <GradesChart grades={averages.sort(a => a.date).reverse().slice(0, 14).map((grade) => {
                        return {...grade, date: timestampToDdMm(grade.date)}
                    })} className="transform-[translateX(-6%)]"/>
                    {averagesBySubject.map((average) =>
                        <AverageCard average={average} key={average.subjectId} onArrowClick={() => {
                            setSelectedAverage(average)
                        }}/>
                    )}</>
                    }
                    {(selectedAverage != null) && <AverageExpandedCard selectedAverage={selectedAverage} goBack={() => setSelectedAverage(null)} /> }
            </CardContent>
        </Card>
    )
}
