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
import {AdminSidebar} from "@/components/AdminSidebar";

export default function HomePage() {
    const userStore = UserStore.useContainer();
    const nextHomeworks = useMemo(() =>
        userStore.homeworks.filter(homework => {
            const homeworkDate = new Date(homework.dueDate);
            return !isNaN(homeworkDate.getTime()) &&
                new Date() < homeworkDate &&
                homeworkDate < new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
        }), [userStore.homeworks]
    );
    return <div
        className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
        <AdminSidebar/>
        <main className="flex flex-col w-full items-center justify-center gap-6">
            <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
                <SidebarTrigger/>
                <div>
                    <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">
                        Welcome, <span className="text-primary">{userStore.getName(true).toString()}!</span>
                    </h1>
                    <h2 className="scroll-m-20 text-xl align-center tracking-tight">Monitor your school&#39;s
                        progress and attendance</h2>
                </div>
                <br/>
            </div>
            <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                Empty :(
            </div>
        </main>
    </div>
}