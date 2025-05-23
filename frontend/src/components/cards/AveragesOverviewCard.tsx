"use client"

import {ArrowLeftIcon, ChevronRight} from "lucide-react"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

import {GradesChart} from "@/components/charts/GradesChart";
import {Gauge} from "@/components/ui/gauge";
import AverageCard from "@/components/cards/grades/AverageCard";
import {useState} from "react";
import GradeCard from "@/components/cards/grades/GradeCard";
import {AnimatePresence, motion} from "framer-motion";
import {Grade} from "@/types/grade";
import AverageExpandedCard from "@/components/cards/grades/AverageExpandedCard";

function timestampToDdMm(timestamp: number): string {
    const date = new Date(timestamp);
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
}

// last in list has to be the current one
export function AveragesOverviewCard({average, generalAverageByDays, averagesBySubject}: {
    average: number,
    generalAverageByDays: { date: number; average: number }[],
    averagesBySubject: { average: number, grades: Grade[], subject: string, subjectId: number, teacherId: number, teacher: string }[]
}) {
    const [selectedAverage, setSelectedAverage] = useState<{ average: number, grades: Grade[], subject: string, subjectId: number, teacherId: number, teacher: string } | null>(null)

    return (
        <motion.div layout whileInView={{opacity: 1}}>
        <Card className="border-t-[2px]">
            <CardHeader>
                <AnimatePresence key={"header"} mode="popLayout">
                {(selectedAverage == null) && <>
                    <CardTitle className="text-2xl font-bold">Averages</CardTitle>
                    <h2 className="text-4xl font-bold">{average || "/"}</h2>
                    <CardDescription>
                        The average for the last 14 active school days
                    </CardDescription>
                </>}
                </AnimatePresence>
            </CardHeader>
            <CardContent>
                <div>
                    {(selectedAverage == null) && <motion.div><h2 className="text-xl font-semibold col-span-3">Subjects</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-1 gap-x-6">
                            <div className="text-center row-span-2">
                                <GradesChart grades={generalAverageByDays.sort(a => a.date).reverse().slice(0, 14)
                                    .map((grade) => {
                                        return {...grade, date: timestampToDdMm(grade.date)}
                                    })} className={"relative top-[50%] transform-[translate(-9%,-50%)]"}/>
                            </div>

                            {averagesBySubject.map((average) =>
                                    <AverageCard average={average} key={average.subjectId} onArrowClick={() => {
                                        setSelectedAverage(average)
                                    }}/>
                                )}
                            </div>
                        </motion.div>}
                    <AnimatePresence key={"subject"}>
                    {(selectedAverage != null) &&
                        <motion.div layout key={"avercard-" + selectedAverage.subjectId} layoutId={"avercard-" + selectedAverage.subjectId.toString()}>
                            <AverageExpandedCard selectedAverage={selectedAverage} goBack={() => {setSelectedAverage(null)}} />
                        </motion.div>
                    }
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
        </motion.div>
    )
}
