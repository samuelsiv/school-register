import {Gauge} from "@/components/ui/gauge";
import {ArrowRightIcon} from "lucide-react";
import {Card} from "@/components/ui/card";

export default function AverageCard({average, onArrowClick}: {
    average: { grade: number, name: string, teacher: string, id: number },
    onArrowClick: () => void
}) {
    return <Card className="flex flex-row gap-12 items-center px-4 py-2 my-2 justify-between border-t border-t-[2px]"
                 key={average.id}>
        <Gauge color={
            (average.grade >= 6) ? "text-[hsla(110,51%,44%,1)]" :
                (average.grade >= 5) ? "text-[hsla(40,51%,44%,1)]" :
                    "text-[hsla(0,51%,44%,1)]"
        } value={average.grade}
               size={"medium"} showValue={true}/>
        <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-xl font-semibold">{average.name}</p>
            <p className="text-m font-light">{average.teacher}</p>
        </div>
        <ArrowRightIcon onClick={() => {
            onArrowClick()
        }}/>
    </Card>
}