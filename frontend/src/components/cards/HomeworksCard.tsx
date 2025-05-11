import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export function HomeworksCard({homeworks}: {homeworks: {id: number, author: string, description: string, date: string}[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Homeworks</CardTitle>
                <CardDescription>
                    Next homeworks to do
                </CardDescription>
            </CardHeader>
            <CardContent>
                {homeworks.map((homework) => <Card key={homework.id}>
                    <CardContent>
                        <h3 className="font-bold">{homework.author}, by {homework.date}</h3>
                        <h2 className="text-xl">{homework.description}</h2>
                    </CardContent>
                    <CardAction className="w-full">
                        <Button variant="default">Done</Button>
                    </CardAction>
                </Card>)}

            </CardContent>
        </Card>
    )
}