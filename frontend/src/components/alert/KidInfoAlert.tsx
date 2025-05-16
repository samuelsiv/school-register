import {BabyIcon} from "lucide-react";
import {CardDescription, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export default function KidInfoAlert({name}: {name: string}) {
    return <div
        className="bg-card text-card-foreground flex flex-cols gap-6 rounded-xl border-t p-6 shadow-md w-[50%] justify-between align-center items-center">
        <div className="flex flex-row gap-4">
            <div className="h-full justify-center items-center flex border-[#444444] border-[1px] rounded-xl p-4">
                <BabyIcon/>
            </div>
            <div className="text-start flex justify-center flex-col text-start">
                <CardTitle>Viewing {name}&#39;s info</CardTitle>
                <CardDescription>You are viewing the school performance of {name}</CardDescription>
            </div>
        </div>
        <div className="flex flex-col h-full justify-center">
            <Button>Contact School</Button>
        </div>
    </div>
}