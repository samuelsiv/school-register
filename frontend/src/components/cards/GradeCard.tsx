import {ArrowRightIcon} from "lucide-react";
import {Card} from "@/components/ui/card";

export default function GradeCard({grade}: {grade: {grade: number, name: string, id: number, date: string}}) {
    return <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between" key={grade.id}>
        <h1 className="text-2xl font-bold">{grade.grade}</h1>
        <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-xl font-semibold">{grade.name}</p>
            <p className="text-m font-light">{grade.date}</p>
        </div>
        <ArrowRightIcon/>
    </Card>
}