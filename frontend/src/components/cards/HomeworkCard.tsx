import {ArrowRightIcon} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Homework} from "@/types/homework";

export default function HomeworkCard({homework}: {homework: Homework}) {
    return <Card className="flex flex-col gap-6 items-center px-4 py-2 my-2 justify-between" key={homework.homeworkId}>
        <h1 className="text-2xl font-bold">{homework.title}</h1>
        <p className="text-xl font-semibold">{homework.description}</p>
        <p className="text-l">Due to: {homework.dueDate}</p>
    </Card>
}