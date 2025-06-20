"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {useState} from "react";
import {
    AlertCircleIcon,
    ChevronRightIcon,
    UserCircleIcon,
    UsersIcon
} from "lucide-react";
import {Card} from "@/components/ui/card";
import { Class } from "@/types/class";
import {AdminSidebar} from "@/components/AdminSidebar";
import AdminStore from "@/stores/admin";
import {CreateClassroomDialog} from "@/components/dialog/CreateClassroomDialog";

export default function AdminClassroomsPage() {
    const adminStore = AdminStore.useContainer();
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)
    return <div
        className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
        <AdminSidebar/>
        <main className="flex flex-col w-full items-center h-full justify-center gap-6">
            <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
                <SidebarTrigger/>
                <div>
                    <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">
                        Welcome, <span className="text-primary">{adminStore.name || ""}!</span>
                    </h1>
                    <h2 className="scroll-m-20 text-xl align-center tracking-tight">Monitor your school&#39;s
                        progress and attendance</h2>
                </div>
                <br/>
            </div>
            <div className="grid grid-rows-2 w-full h-full md:grid-rows-1 xl:grid-rows-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-12">
                <div className="flex flex-col gap-6 w-full justify-start">
                    <div className="flex flex-row items-center gap-4 py-2 w-full justify-between">
                        <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">Classrooms</h2>
                        <CreateClassroomDialog teachers={adminStore.teachers} onCreate={() => {
                            window.location.reload();

                        }}/>
                    </div>
                    {adminStore.classes.map(classroom =>
                        <Card className={"flex flex-row items-center gap-4 px-2 py-2 w-full justify-start ring-sidebar-ring" + ((selectedClass?.classId == classroom.classId) ? " ring-1" : "")}
                        onClick={() => setSelectedClass(classroom)}
                        key={classroom.classId}>
                            <div className="flex flex-row items-center gap-4  px-2 py-2 w-full justify-start">
                                <UsersIcon />
                                <span className="text-lg font-semibold">{classroom.className}</span>
                            </div>
                            <ChevronRightIcon />
                        </Card>
                    )}
                </div>
                <Card className="flex flex-col gap-6 w-full h-[80vh] justify-start">
                    {selectedClass == null &&
                        <div className="w-full h-full flex align-center items-center justify-center flex-col gap-4">
                            <AlertCircleIcon size="36" />
                            <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">No classroom selected</h2>
                        </div>
                    }
                    {selectedClass != null && <div className="w-full h-full flex items-center flex-col gap-4">
                        <UserCircleIcon size={72} />
                        <h1 className="text-3xl font-semibold">{selectedClass.className}</h1>
                        <div className={"w-full flex justify-start px-4 flex-col gap-4 items-start"}>
                            <h1 className="text-2xl font-semibold">Student count: {selectedClass.studentCount}</h1>
                            <h1 className="text-2xl font-semibold">School year: {selectedClass.schoolYear}</h1>
                            <h1 className="text-2xl font-semibold">Coordinated by {selectedClass.coordinator}</h1>
                        </div>
                    </div>}
                </Card>
            </div>
        </main>
    </div>
}