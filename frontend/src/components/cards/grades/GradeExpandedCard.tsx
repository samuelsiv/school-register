import {Card} from "@/components/ui/card";
import {motion} from "framer-motion";
import {ChevronRight} from "lucide-react";
import {Gauge} from "@/components/ui/gauge";
import {Grade} from "@/types/grade";

export function GradeExpandedCard({selectedGrade, goBack}: {selectedGrade: Grade, goBack: () => void}) {
    return <motion.div layout layoutId={selectedGrade.gradeId.toString()} key={"grade"}>
        <Card className="flex flex-col gap-6 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]">
            <div className="grid w-full">
                <div className="flex flex-row w-full justify-center col-start-1 row-start-1">
                    <motion.p layoutId={`${selectedGrade.gradeId}-subjectname`} layout
                              className="text-xl font-semibold">{selectedGrade.subjectName}</motion.p>
                </div>
                <div className="flex flex-row w-full col-start-1 row-start-1" onClick={goBack}>
                    <motion.div style={{rotate: 180}} layoutId={`${selectedGrade.gradeId}-arrow`}>
                        <ChevronRight/>
                    </motion.div>
                </div>
            </div>

            <Gauge color={
                (selectedGrade.value >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                    (selectedGrade.value >= 5) ? "text-[hsla(40,51%,44%,1)]" :
                        "text-[hsla(0,51%,44%,1)]"
            } value={selectedGrade.value} gradeId={selectedGrade.gradeId.toString()}
                   size={"medium"} showValue={true}/>
            {selectedGrade.comment != "" &&
                <motion.p layoutId={`${selectedGrade.gradeId}-comment`} layout
                          className="text-m font-light">{selectedGrade.comment}</motion.p>
            }
            <motion.p layout layoutId={`${selectedGrade.gradeId}-inserted`}
                      className="text-l font-light">{selectedGrade.insertedAt}</motion.p>
        </Card>
    </motion.div>
}