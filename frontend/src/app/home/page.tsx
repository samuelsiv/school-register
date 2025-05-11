import {LoginForm} from "@/components/forms/LoginSchema";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/AppSidebar";
import {DashAverageGradesChart} from "@/components/charts/DashAverageGradesChart";
import {HomeworksCard} from "@/components/cards/HomeworksCard";
import {EventsCard} from "@/components/cards/AbsencesCard";
import {EventType} from "@/types/eventType";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {BabyIcon} from "lucide-react";
import {Button} from "@/components/ui/button";


export default function HomePage() {
    return <div className="bg-background text-foreground flex items-center p-6 gap-6 text-center">
        <SidebarProvider>
            <AppSidebar activeItem={"#"} activeChild={"Alex Johnson"} />
            <main className="flex flex-col w-full items-center justify-center gap-6">
                <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
                    <SidebarTrigger/>
                    <div>
                        <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">Welcome,
                            [name]!</h1>
                        <h2 className="scroll-m-20 text-xl align-center tracking-tight">Monitor your child&#39;s school
                            progress and attendance</h2>
                    </div>
                    <br/>

                </div>
                <div className="bg-card text-card-foreground flex flex-cols gap-6 rounded-xl border p-6 shadow-sm w-[50%] justify-between">
                    <div className="flex flex-row gap-4">
                    <div className="h-full justify-center items-center flex border-[#444444] border-[1px] rounded-xl p-4">
                        <BabyIcon />
                    </div>
                    <div className="text-start flex justify-center flex-col text-start">
                        <CardTitle>Viewing Alex&#39;s info</CardTitle>
                        <CardDescription>You are viewing the school performance of Alex Johnson</CardDescription>
                    </div>
                    </div>
                    <Button className="h-full">Contact School</Button>
                </div>
                <div className="grid grid-rows-4 grid-cols-3 gap-12">
                    <DashAverageGradesChart
                        grades={[{grade: 8, day: "08/02"}, {grade: 7, day: "09/02"}, {grade: 9, day: "10/02"}]}/>
                    <HomeworksCard homeworks={[{
                        id: 123,
                        author: "mr. John Doe (not the parent)",
                        description: "Study from page 186 of the English Textbook to page 244",
                        date: "17/04/2025"
                    }]}/>
                    <EventsCard events={[{
                        id: 123,
                        type: EventType.ABSENCE,
                        date: "17/04/2025"
                    }]}/>
                </div>
            </main>
        </SidebarProvider>
    </div>
}