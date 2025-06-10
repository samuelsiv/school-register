"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/AppSidebar";
import KidInfoAlert from "@/components/alert/KidInfoAlert";
import {AveragesOverviewCard} from "@/components/cards/AveragesOverviewCard";
import {GradesListCard} from "@/components/cards/GradesListCard";
import UserStore from "@/stores/user";

export default function Grades() {
    const userStore = UserStore.useContainer();
    return <div
        className="w-full text-foreground flex items-center p-3 gap-6 text-center h-full">
        <AppSidebar/>

        <main className="flex flex-col w-full items-center justify-center gap-6">
            <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
                <SidebarTrigger/>
                <div>
                    <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight text-primary">Grades</h1>
                    <h2 className="scroll-m-20 text-xl align-center tracking-tight">Here are your child&#39;s latest
                        exam results!</h2>
                </div>
                <br/>
            </div>
            {userStore.isParent && userStore.selectedStudent != null &&
                <KidInfoAlert name={userStore.selectedStudent.name}/>
            }
            <div className="grid grid-rows-2 grid-cols-1 gap-12">
                <AveragesOverviewCard
                    average={userStore.average}
                    generalAverageByDays={userStore.averageByDay}
                    averagesBySubject={userStore.averageBySubject || []} />
                <GradesListCard grades={userStore.grades}/>
            </div>
        </main>
    </div>
}