import {Card} from "@/components/ui/card";
import {Homework} from "@/types/homework";

export default function HomeworkCard({homework}: { homework: Homework }) {
    return <Card className="flex flex-col gap-1 items-center p-4 justify-between border-t border-t-[2px]"
                 key={homework.homeworkId}>
        <p className="text-xl font-light">{homework.subjectName} - {homework.teacherName}</p>
        <h1 className="text-2xl font-bold">{homework.title}</h1>
        <p className="text-l">{homework.description}</p>
    </Card>
}