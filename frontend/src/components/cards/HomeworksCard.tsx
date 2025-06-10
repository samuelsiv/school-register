import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Homework} from "@/types/homework";
import HomeworkCard from "@/components/cards/HomeworkCard";

export function HomeworksCard({homeworks}: { homeworks: Homework[] }) {
    return (
        <Card className="border-t-[2px]">
            <CardHeader>
                <CardTitle className="text-2xl">Homeworks</CardTitle>
                <CardDescription>
                    Next homeworks to do
                </CardDescription>
            </CardHeader>
            <CardContent>
                {homeworks.map((homework: Homework) => <HomeworkCard homework={homework} key={homework.homeworkId}/>)}
            </CardContent>
        </Card>
    )
}
