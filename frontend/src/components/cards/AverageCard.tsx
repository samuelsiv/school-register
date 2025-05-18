import {Gauge} from "@/components/ui/gauge";
import {ArrowRightIcon, ChevronRight} from "lucide-react";
import {Card} from "@/components/ui/card";
import {motion} from "framer-motion";
import {Grade} from "@/types/grade";

export default function AverageCard({average, onArrowClick}: {
    average: { average: number, grades: Grade[], subject: string, subjectId: number, teacherId: number, teacher: string },
    onArrowClick: () => void
}) {
    return <motion.div layout key={average.subjectId} layoutId={average.subjectId.toString()}>
        <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]"
              key={average.subjectId}>
            <Gauge color={
                (average.average >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                    (average.average >= 5) ? "text-[hsla(40,51%,44%,1)]" :
                        "text-[hsla(0,51%,44%,1)]"
            } value={average.average} gradeId={average.subjectId}
                   size={"medium"} showValue={true}/>
            <div className="flex flex-col gap-2 justify-center items-center">
                <motion.p className={"text-xl font-semibold"}
                           layoutId={`${average.subjectId}-name`} layout>{average.subject}</motion.p>
                <motion.h2 className={"text-m font-light"}
                           layoutId={`${average.subjectId}-teacher`} layout>{average.teacher}</motion.h2>
            </div>
            <motion.div style={{rotate: 0}} layoutId={`${average.subjectId}-arrow`}><ChevronRight onClick={() =>
                onArrowClick()
            }/></motion.div>
        </Card></motion.div>
}