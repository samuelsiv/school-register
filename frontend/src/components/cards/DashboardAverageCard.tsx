"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

import {GradesChart} from "@/components/charts/GradesChart";
import {motion} from "framer-motion";

function timestampToDdMm(timestamp: number): string {
    const date = new Date(timestamp);
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
}

// last in list has to be the current one
export function DashboardAverageCard({average, grades}: {
    average: number,
    grades: { date: number; average: number }[]
}) {
    return (
        <Card className="border-t border-t-[2px]">
            <CardHeader>
                <CardTitle>Grade Average</CardTitle>
                <h2 className="text-2xl font-bold">{average || "/"}</h2>
                <CardDescription>
                    Last 14 active school days
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GradesChart grades={grades.sort(a => a.date).reverse().slice(0, 14).map((grade) => {
                    return {...grade, date: timestampToDdMm(grade.date)}
                })}/>
            </CardContent>
        </Card>
    )
}
