import {ArrowRightIcon} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Grade} from "@/types/grade";

export default function GradeCard({grade}: { grade: Grade }) {
    return <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]"
                 key={grade.gradeId}>
        <h1 className="text-2xl font-bold">{grade.value}</h1>
        <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-xl font-semibold">{grade.subjectName}</p>
            <p className="text-m font-light">{grade.insertedAt}</p>
        </div>
        <ArrowRightIcon/>
    </Card>
}