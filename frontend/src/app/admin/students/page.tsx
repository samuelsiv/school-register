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
import {useMemo, useState} from "react";
import {TeacherSidebar} from "@/components/TeacherSidebar";
import {Student} from "@/types/student";
import {AlertCircleIcon, ChevronRightIcon, PlusIcon, UserCircle, UserCircleIcon, UserIcon} from "lucide-react";
import {Card} from "@/components/ui/card";
import {AdminSidebar} from "@/components/AdminSidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {CreateStudentDialog} from "@/components/dialog/CreateStudentDialog";
import {Class} from "@/types/class";
import AdminStore from "@/stores/admin";
import {ExtendedUserInfo, NewUser} from "@/types/userInfo";
import { NewUserDialog } from "@/components/dialog/NewUserDialog";

export default function AdminStudentsPage() {
    const adminStore = AdminStore.useContainer();
    const [selectedUser, setSelectedUser] = useState<ExtendedUserInfo | null>(null)
    const [newUser, setNewUser] = useState<NewUser | null>(null)

    const classes: Class[] = [{
        className: "5^B",
        classId: 1,
        coordinator: "Marco Francesco",
        studentCount: 6,
        schoolYear: "2025"
    }]

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
                        <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">Students</h2>
                        <CreateStudentDialog classes={classes} inserted={(user) => {
                            adminStore.reloadStudents()
                            setNewUser(user)
                        }}/>
                        { newUser != null && <NewUserDialog user={newUser} /> }
                    </div>
                    {adminStore.students.map(student =>
                        <Card className={"flex flex-row items-center gap-4 px-2 py-2 w-full justify-start ring-sidebar-ring" + ((selectedUser?.studentId == student.studentId) ? " ring-1" : "")}
                        onClick={() => setSelectedUser(student)} key={student.studentId}>
                            <div className="flex flex-row items-center gap-4  px-2 py-2 w-full justify-start">
                                <UserIcon />
                                <span className="text-lg font-semibold">{student.name} {student.surname}</span>
                            </div>
                            <ChevronRightIcon />
                        </Card>
                    )}
                </div>
                <Card className="flex flex-col gap-6 w-full h-[80vh] justify-start">
                    {selectedUser == null &&
                        <div className="w-full h-full flex align-center items-center justify-center flex-col gap-4">
                            <AlertCircleIcon size="36" />
                            <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">No student selected</h2>
                        </div>
                    }
                    {selectedUser != null && <div className="w-full h-full flex items-center flex-col gap-4">
                        <UserCircleIcon size={72} />
                        <h1 className="text-3xl font-semibold">{selectedUser.name} {selectedUser.surname}</h1>
                        <div className={"w-full flex justify-start px-4 flex-col gap-4 items-start"}>
                            <h1 className="text-2xl font-semibold">Average: 2</h1>
                            <h1 className="text-2xl font-semibold">Comes from: Milan</h1>
                            <h1 className="text-2xl font-semibold">other info</h1>
                        </div>
                    </div>}
                </Card>
            </div>
        </main>
    </div>
}