"use client"


import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {useState} from "react";
import {Grade} from "@/types/grade";
import {AnimatePresence, motion} from "framer-motion";
import GradeCard from "@/components/cards/grades/GradeCard";
import {GradeExpandedCard} from "@/components/cards/grades/GradeExpandedCard";

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
                {(selectedGrade == null) && <div className={`grid grid-cols-${cols || '3'} gap-3`} key={"grades"}>
                    {grades.slice(0, 3).map((grade) =>
                        <motion.div layout key={grade.gradeId} layoutId={grade.gradeId.toString()}>
                            <GradeCard grade={grade} expand={() => setGrade(grade)} />
                        </motion.div>
                    )}
                </div>}
                </AnimatePresence>
                <AnimatePresence mode="popLayout">
                    {(selectedGrade != null) && <GradeExpandedCard selectedGrade={selectedGrade} goBack={() => setGrade(null)} /> }
                </AnimatePresence>
            </CardContent>
        </Card>
        </motion.div>
    )
}
