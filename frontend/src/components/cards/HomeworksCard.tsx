import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Homework} from "@/types/homework";
import HomeworkCard from "@/components/cards/homeworks/HomeworkCard";
import HomeworkExpandedCard from "@/components/cards/homeworks/HomeworkExpandedCard";
import {useState} from "react";
import {AlertCircleIcon, CheckCircle} from "lucide-react";

export function HomeworksCard({homeworks}: { homeworks: Homework[] }) {
    const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null)

    return (
        <Card className="border-t-[2px]">
            <CardHeader>
                <CardTitle className="text-2xl">Homeworks</CardTitle>
                <CardDescription>
                    Next homeworks to do
                </CardDescription>
            </CardHeader>
            <CardContent>
                {homeworks.length == 0 && <div className="w-full h-full flex align-center items-center justify-center flex-col gap-4">
                    <CheckCircle size="36" />
                    <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">No homeworks to do!</h2>
                </div>
                }

                { selectedHomework == null && homeworks.map((homework: Homework) => <HomeworkCard homework={homework} onArrowClick={() => {
                    setSelectedHomework(homework)
                }}/>)}
                {(selectedHomework != null) && <HomeworkExpandedCard homework={selectedHomework} goBack={() => setSelectedHomework(null)} /> }
            </CardContent>
        </Card>
    )
}
