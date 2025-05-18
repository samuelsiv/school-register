"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

import {GradesChart} from "@/components/charts/GradesChart";
import {AnimatePresence, motion} from "framer-motion";
import {Grade} from "@/types/grade";
import GradeCard from "@/components/cards/GradeCard";
import AverageCard from "@/components/cards/AverageCard";
import {useState} from "react";
import {ChevronRight} from "lucide-react";
import {Gauge} from "@/components/ui/gauge";

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
        <Card className="border-t border-t-[2px]">
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
                    {(selectedAverage != null) &&
                        <motion.div layout key={selectedAverage.subjectId} layoutId={selectedAverage.subjectId.toString()}>
                            <Card className="flex items-center gap-2 px-4 py-2 my-2 border-t border-t-[2px]"
                                  key={selectedAverage.subjectId}>
                                <div className="grid w-full">

                                    <div className="col-start-1 row-start-1 w-full items-center">
                                        <motion.p className={"text-xl font-semibold"}
                                                  layoutId={`${selectedAverage.subjectId}-name`}
                                                  layout>{selectedAverage.subject}</motion.p>
                                    </div>
                                    <div className="col-start-1 row-start-1 w-full flex justify-start">
                                        <motion.div style={{ rotate: 180 }} layoutId={`${selectedAverage.subjectId}-arrow`}><ChevronRight onClick={() =>
                                            setSelectedAverage(null)
                                        }/></motion.div>
                                    </div>
                                </div>
                                <motion.h2 className={"text-l font-light"}
                                           layoutId={`${selectedAverage.subjectId}-teacher`}
                                           layout>{selectedAverage.teacher}</motion.h2>
                                <Gauge color={
                                    (selectedAverage.average >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                                        (selectedAverage.average >= 5) ? "text-[hsla(40,51%,44%,1)]" :
                                            "text-[hsla(0,51%,44%,1)]"
                                } value={selectedAverage.average} gradeId={selectedAverage.subjectId}
                                       size={"medium"} showValue={true}/>
                                {selectedAverage.grades.map((grade) =>
                                    <GradeCard grade={grade} key={grade.gradeId}/>
                                )}
                            </Card>
                        </motion.div>
                    }
            </CardContent>
        </Card>
    )
}
