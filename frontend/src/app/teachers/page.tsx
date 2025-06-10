"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/AppSidebar";
import {HomeworksCard} from "@/components/cards/HomeworksCard";
import {EventsCard} from "@/components/cards/AbsencesCard";
import {EventType} from "@/types/eventType";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import {DashboardAverageCard} from "@/components/cards/DashboardAverageCard";
import {GradesListCard} from "@/components/cards/GradesListCard";
import UserStore from "@/stores/user";
import {useMemo} from "react";
import {Card} from "@/components/ui/card";
import {GraduationCapIcon} from "lucide-react";

export default function HomePage() {
    const userStore = UserStore.useContainer();
    return <div
        className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
        <main className="flex flex-col w-full items-center justify-center gap-6">
            <div id="title" className="flex flex-row gap-12 w-full justify-center items-center">
                <div>
                    <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">
                        Welcome, <span className="text-primary">{userStore.getName(true).toString()}!</span>
                    </h1>
                    <h2 className="scroll-m-20 text-xl align-center tracking-tight">Select which class you want to monitor</h2>
                </div>
                <br/>
            </div>

            <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                {userStore.teacherClasses.map(teacherClass => <Card className={"p-4 border-t-[2px] gap-4 items-center"}>
                    <GraduationCapIcon />
                    <h1 className="font-bold text-2xl">{teacherClass.className}</h1>
                </Card>)}
            </div>
        </main>
    </div>
}