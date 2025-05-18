import {Gauge} from "@/components/ui/gauge";
import {ArrowRightIcon, ChevronRight} from "lucide-react";
import {Card} from "@/components/ui/card";
import {motion} from "framer-motion";

export default function AverageCard({average, onArrowClick}: {
    average: { grade: number, name: string, teacher: string, id: number },
    onArrowClick: () => void
}) {
    return <motion.div layout key={average.id} layoutId={average.id.toString()}>
        <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]"
              key={average.id}>
            <Gauge color={
                (average.grade >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                    (average.grade >= 5) ? "text-[hsla(40,51%,44%,1)]" :
                        "text-[hsla(0,51%,44%,1)]"
            } value={average.grade} gradeId={average.id}
                   size={"medium"} showValue={true}/>
            <div className="flex flex-col gap-2 justify-center items-center">
                <motion.h1 className={"text-xl font-semibold"}
                           layoutId={`${average.id}-name`} layout={"position"}>{average.name}</motion.h1>
                <motion.h2 className={"text-m font-light"}
                           layoutId={`${average.id}-teacher`} layout>{average.teacher}</motion.h2>
            </div>
            <motion.div style={{rotate: 0}} layoutId={`${average.id}-arrow`}><ChevronRight onClick={() =>
                onArrowClick()
            }/></motion.div>
        </Card></motion.div>
}