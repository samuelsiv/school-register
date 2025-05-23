import {motion} from "framer-motion";
import {ChevronRight} from "lucide-react";
import {Gauge} from "@/components/ui/gauge";
import GradeCard from "@/components/cards/grades/GradeCard";
import {Card} from "@/components/ui/card";
import {Grade} from "@/types/grade";

export default function AverageExpandedCard({selectedAverage, goBack}: {selectedAverage: { average: number, grades: Grade[], subject: string, subjectId: number, teacherId: number, teacher: string }, goBack: () => void}) {
    return <Card className="flex items-center gap-2 px-4 py-2 my-2 border-t border-t-[2px]"
          key={selectedAverage.subjectId}>
        <div className="grid w-full">

            <div className="col-start-1 row-start-1 w-full items-center">
                <motion.p className={"text-xl font-semibold"}
                          layoutId={`${selectedAverage.subjectId}-name`}
                          layout>{selectedAverage.subject}</motion.p>
            </div>
            <div className="col-start-1 row-start-1 w-full flex justify-start">
                <motion.div style={{ rotate: 180 }} layoutId={`${selectedAverage.subjectId}-arrow`}><ChevronRight onClick={
                    goBack
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
            <GradeCard grade={grade} key={grade.subjectId}/>
        )}
    </Card>
}