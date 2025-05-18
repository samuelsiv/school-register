"use client"

import {ArrowLeftIcon, ArrowRightIcon, ChevronRight} from "lucide-react"

import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {Gauge} from "@/components/ui/gauge";
import {useState} from "react";
import {Grade} from "@/types/grade";
import {AnimatePresence, motion} from "framer-motion";

// last in list has to be the current one
export function GradesListCard({grades, cols}: { grades: Grade[], cols?: number | null }) {
    const [selectedGrade, setGrade] = useState<Grade | null>()
    return (
        <motion.div layout whileInView={{opacity: 1}}>
        <Card className="border-t-[2px]">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Latest Grades</CardTitle>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="popLayout">
                {(selectedGrade == null) && <div className={`grid grid-cols-${cols || '3'} gap-6`} key={"grades"}>
                    {grades.map((grade) =>
                        <motion.div layout layoutId={grade.gradeId.toString()}>
                        <Card
                            className="flex flex-row gap-6 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]"
                            key={grade.gradeId} onClick={() => setGrade(grade)}>
                            <motion.h1 layout layoutId={`${grade.gradeId}-grade`}
                                       className="text-2xl font-bold">{grade.value}</motion.h1>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <motion.p layout layoutId={`${grade.gradeId}-subjectname`}
                                          className="text-xl font-semibold">{grade.subjectName}</motion.p>
                                <motion.p layout layoutId={`${grade.gradeId}-inserted`} className="text-l font-light">{grade.insertedAt}</motion.p>
                                {grade.comment != "" &&
                                    <motion.p layout layoutId={`${grade.gradeId}-comment`}
                                              className="text-m font-light">{grade.comment}</motion.p>
                                }
                            </div>
                            <motion.div style={{ rotate: 0 }} layoutId={`${grade.gradeId}-arrow`}><ChevronRight/></motion.div>
                        </Card>
                        </motion.div>
                    )}
                </div>}
                </AnimatePresence>
                <AnimatePresence mode="popLayout">
                {(selectedGrade != null) &&
                    <motion.div layout layoutId={selectedGrade.gradeId.toString()} key={"grade"}>
                        <Card
                            className="flex flex-col gap-6 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]"
                        >
                            <div className="grid w-full">
                                <div className="flex flex-row w-full justify-center col-start-1 row-start-1">
                                    <motion.p layoutId={`${selectedGrade.gradeId}-subjectname`} layout
                                              className="text-xl font-semibold">{selectedGrade.subjectName}</motion.p>
                                </div>
                                <div className="flex flex-row w-full col-start-1 row-start-1" onClick={() => {
                                    setGrade(null)
                                }}>
                                    <motion.div style={{rotate: 180}} layoutId={`${selectedGrade.gradeId}-arrow`}>
                                        <ChevronRight/></motion.div>
                                </div>
                            </div>


                            <Gauge color={
                                (selectedGrade.value >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                                    (selectedGrade.value >= 5) ? "text-[hsla(40,51%,44%,1)]" :
                                        "text-[hsla(0,51%,44%,1)]"
                            } value={selectedGrade.value} gradeId={selectedGrade.gradeId}
                                   size={"medium"} showValue={true}/>
                            {selectedGrade.comment != "" &&
                                <motion.p layoutId={`${selectedGrade.gradeId}-comment`} layout
                                          className="text-m font-light">{selectedGrade.comment}</motion.p>
                            }
                            <motion.p layout layoutId={`${selectedGrade.gradeId}-inserted`}
                                      className="text-l font-light">{selectedGrade.insertedAt}</motion.p>

                        </Card>
                    </motion.div>}
                </AnimatePresence>
            </CardContent>
        </Card>
        </motion.div>
    )
}
