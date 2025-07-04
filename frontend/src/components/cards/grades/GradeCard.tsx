import {ChevronRight} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Grade} from "@/types/grade";
import {motion} from "framer-motion";

export default function GradeCard({grade, expand}: { grade: Grade, expand?: (() => void) }) {
  return <Card
    className="flex flex-row gap-6 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]"
    key={grade.gradeId} onClick={expand}>
    <motion.h1 layout layoutId={`${grade.gradeId}-grade`}
               className="text-2xl font-bold">{grade.value}</motion.h1>
    <div className="flex flex-col gap-2 justify-center items-center">
      <motion.p layout layoutId={`${grade.gradeId}-subjectname`}
                className="text-xl font-semibold">{grade.subjectName}</motion.p>
      <motion.p layout layoutId={`${grade.gradeId}-inserted`}
                className="text-l font-light">{grade.insertedAt}</motion.p>
      {grade.comment != "" &&
          <motion.p layout layoutId={`${grade.gradeId}-comment`}
                    className="text-m font-light">{grade.comment}</motion.p>
      }
    </div>
    {expand && <motion.div style={{rotate: 0}} layoutId={`${grade.gradeId}-arrow`}><ChevronRight/></motion.div>}
  </Card>
}