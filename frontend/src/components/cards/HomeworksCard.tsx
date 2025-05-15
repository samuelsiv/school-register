import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Homework} from "@/types/Homework";
import HomeworkCard from "@/components/cards/HomeworkCard";

export function HomeworksCard({homeworks}: {homeworks: Homework[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Homeworks</CardTitle>
                <CardDescription>
                    Next homeworks to do
                </CardDescription>
            </CardHeader>
            <CardContent>
                {homeworks.map((homework: Homework) => <HomeworkCard homework={homework} key={homework.homeworkId}/> )}

            </CardContent>
        </Card>
    )
}