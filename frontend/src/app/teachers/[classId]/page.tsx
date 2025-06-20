"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {TeacherSidebar} from "@/components/TeacherSidebar";
import TeacherStore from "@/stores/teacher";

export default function HomePage() {
    const teacherStore = TeacherStore.useContainer();

    return <div
        className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
        <TeacherSidebar/>
        <main className="flex flex-col w-full items-center justify-center gap-6">
            <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
                <SidebarTrigger/>
                <div>
                    <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">
                        Welcome, <span className="text-primary">{teacherStore.name || ""}!</span>
                    </h1>
                    <h2 className="scroll-m-20 text-xl align-center tracking-tight">Monitor your students&#39; school
                        progress and attendance</h2>
                </div>
                <br/>
            </div>

            <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                Empty :/
            </div>
        </main>
    </div>
}