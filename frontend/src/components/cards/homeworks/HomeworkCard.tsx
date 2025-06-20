import {Card} from "@/components/ui/card";
import {Homework} from "@/types/homework";
import {motion} from "framer-motion";
import {ChevronRight} from "lucide-react";

export default function HomeworkCard({homework, onArrowClick}: {
    homework: Homework, onArrowClick: () => void
}) {
    return <motion.div layout key={"hwcard-" + homework.homeworkId} layoutId={"hwcard-" + homework.homeworkId.toString()}>
        <Card className="flex flex-col gap-1 items-center p-4 justify-between border-t-[2px]"
              key={"hwcard-card-" + homework.homeworkId} onClick={onArrowClick}>
        <motion.p className="text-xl font-light" layoutId={"hwcard-subj" + homework.homeworkId}>{homework.subjectName} - {homework.teacherName}</motion.p>
        <motion.h1 className="text-2xl font-bold" layoutId={"hwcard-title" + homework.homeworkId}>{homework.title}</motion.h1>
        <motion.p className="text-l" layoutId={"hwcard-desc" + homework.homeworkId}>{homework.description}</motion.p>
            <motion.div style={{rotate: 0}} layoutId={`hw${homework.homeworkId}-arrow`}><ChevronRight /></motion.div>
        </Card>
    </motion.div>
}