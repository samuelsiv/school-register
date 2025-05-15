"use client"

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/AppSidebar";
import {GradesChart} from "@/components/charts/GradesChart";
import {HomeworksCard} from "@/components/cards/HomeworksCard";
import {EventsCard} from "@/components/cards/AbsencesCard";
import {EventType} from "@/types/EventType";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {BabyIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useGrades, useUserInfo} from "@/lib/data";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import {AveragesOverviewCard} from "@/components/cards/AveragesOverviewCard";
import {GradesListCard} from "@/components/cards/GradesListCard";
import {useEffect, useState} from "react";
import {Student} from "@/types/Student";
import {getJsonStore, getStore} from "@/lib/storage";


export default function Grades() {
    const { userInfo, isLoading, isError } = useUserInfo()
    const { grades, isLoadingGrades, isErrorGrades } = useGrades()

    const [child, _setChild] = useState<Student | undefined>(userInfo?.students[0])
    const setChild = (childName: Student) => {
        localStorage.setItem("child", JSON.stringify(childName))
        _setChild(childName)
    }
    useEffect(() => {
        _setChild(getJsonStore("child") || userInfo?.students[0])
    }, [userInfo]);
    return <div className="bg-background text-foreground flex items-center p-2 gap-6 text-center">
        <SidebarProvider>
            <AppSidebar activeItem={"/home/grades"} activeChild={child} onSelectChildAction={setChild} />
            <main className="flex flex-col w-full items-center justify-center gap-6">
                <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
                    <SidebarTrigger/>
                    <div>
                        <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">Grades</h1>
                        <h2 className="scroll-m-20 text-xl align-center tracking-tight">Here are your child&#39;s latest exam results!</h2>
                    </div>
                    <br/>
                </div>
                <KidInfoAlert name={child?.studentName || ""} />
                <div className="grid grid-rows-1 grid-cols-2 gap-12">
                    <AveragesOverviewCard
                        generalAverageByDays={[{grade: 8, day: "08/02"}, {grade: 7, day: "09/02"}, {grade: 9, day: "10/02"}]}
                        averagesBySubject={[{name: "Maths", teacher: "John Doe", grade: 6, id: 321, grades: [{name: "Math", date: "09/02/2025", grade: 6, id: 321}]},
                            {name: "History", teacher: "Jane Doe", grade: 5, id: 3211, grades: [{name: "History", date: "11/05/2025", grade: 5, id: 321}]}]}/>
                    <GradesListCard grades={[{name: "Maths", date: "09/02/2025", grade: 6, id: 321},
                        {name: "History", date: "11/05/2025", grade: 5, id: 321}]} />
                </div>
            </main>
        </SidebarProvider>
    </div>
}