import {Card} from "@/components/ui/card";
import {Homework} from "@/types/homework";
import {motion} from "framer-motion";
import {ChevronRight} from "lucide-react";
export default function HomeworkExpandedCard({homework, goBack}: {
    homework: Homework, goBack: () => void
}) {
    return <motion.div layout key={"hwcard-" + homework.homeworkId} layoutId={"hwcard-" + homework.homeworkId.toString()} className={"w-full col-span-3"}>
        <Card className="flex items-center gap-2 px-4 py-2 my-2 w-full border-t-[2px]"
              key={"hwcard-card-" + homework.homeworkId} onClick={goBack}>
            <div className="grid w-full">
                <div className="col-start-1 row-start-1 w-full items-center">
                    <motion.h2 className={"text-xl font-bold"}
                               layoutId={"hwcard-subj" + homework.homeworkId}
                               layout>{homework.subjectName} - {homework.teacherName} </motion.h2>
                </div>
                <div className="col-start-1 row-start-1 w-full flex justify-start">
                    <motion.div style={{ rotate: 180 }} layoutId={`hw${homework.homeworkId}-arrow`}><ChevronRight onClick={
                        goBack
                    }/></motion.div>
                </div>
            </div>

            <motion.h1 className="text-2xl font-bold" layoutId={"hwcard-title" + homework.homeworkId}>{homework.title}</motion.h1>

            <motion.p className={"text-l font-light"}
                       layoutId={"hwcard-desc" + homework.homeworkId}
                       layout>{homework.description}</motion.p>
            <hr className="my-2 border-1 border-gray-700 w-full"/>
            <motion.p className={"text-l font-light"}
                      layoutId={"hwcard-assigned" + homework.homeworkId}
                      layout>Assigned {homework.createdAt}, due to {homework.dueDate}</motion.p>
        </Card>
    </motion.div>
}