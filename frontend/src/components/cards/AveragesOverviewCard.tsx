"use client"

import {ArrowLeftIcon, ChevronRight} from "lucide-react"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"

import {GradesChart} from "@/components/charts/GradesChart";
import {Gauge} from "@/components/ui/gauge";
import AverageCard from "@/components/cards/AverageCard";
import {useState} from "react";
import GradeCard from "@/components/cards/GradeCard";
import {AnimatePresence, motion} from "framer-motion";

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
    averagesBySubject: {
        grade: number, name: string, teacher: string, id: number, grades:
            { grade: number, name: string, id: number, date: string }[]
    }[]
}) {
    const [selectedAverage, setSelectedAverage] = useState<{
        grade: number,
        name: string,
        teacher: string,
        id: number,
        grades: { grade: number, name: string, id: number, date: string }[]
    } | null>(null)

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
                            <div className="grid grid-cols-3 grid-rows-3 gap-x-6">
                                <div className="text-center row-span-2">
                                    <GradesChart grades={generalAverageByDays.sort(a => a.date).reverse().slice(0, 14)
                                        .map((grade) => {
                                            return {...grade, date: timestampToDdMm(grade.date)}
                                        })} className={"relative top-[50%] transform-[translate(-9%,-50%)]"}/>
                                </div>

                                {averagesBySubject.map((average) =>
                                    <AverageCard average={average} key={average.id} onArrowClick={() => {
                                        setSelectedAverage(average)
                                    }}/>
                                )}
                            </div>
                        </motion.div>}
                        {(selectedAverage != null) &&
                            <motion.div layout key={selectedAverage.id} layoutId={selectedAverage.id.toString()}>
                                <Card className="flex items-center gap-2 px-4 py-2 my-2 border-t border-t-[2px]"
                                      key={selectedAverage.id}>
                                    <div className="grid w-full">

                                        <div className="col-start-1 row-start-1 w-full items-center">
                                            <motion.h1 className={"text-xl font-semibold"}
                                                       layoutId={`${selectedAverage.id}-name`}
                                                       layout={"position"}>{selectedAverage.name}</motion.h1>
                                        </div>
                                        <div className="col-start-1 row-start-1 w-full flex justify-start">
                                            <motion.div style={{ rotate: 180 }} layoutId={`${selectedAverage.id}-arrow`}><ChevronRight onClick={() =>
                                                setSelectedAverage(null)
                                            }/></motion.div>
                                        </div>
                                    </div>
                                    <motion.h2 className={"text-l font-light"}
                                               layoutId={`${selectedAverage.id}-teacher`}
                                               layout>{selectedAverage.teacher}</motion.h2>
                                    <Gauge color={
                                    (selectedAverage.grade >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                                        (selectedAverage.grade >= 5) ? "text-[hsla(40,51%,44%,1)]" :
                                            "text-[hsla(0,51%,44%,1)]"
                                } value={selectedAverage.grade} gradeId={selectedAverage.id}
                                       size={"medium"} showValue={true}/>
                                {selectedAverage.grades.map((grade) =>
                                    <GradeCard grade={grade} key={grade.id}/>
                                )}
                                </Card>
                            </motion.div>
                        }
                </div>
            </CardContent>
        </Card>
        </motion.div>
    )
}
