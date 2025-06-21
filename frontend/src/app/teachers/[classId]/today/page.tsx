"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {TeacherSidebar} from "@/components/TeacherSidebar";
import TeacherStore from "@/stores/teacher";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ChevronLeftCircleIcon, ChevronLeftIcon, ChevronRightCircleIcon, CopyIcon} from "lucide-react";

export default function TeacherTodayPage() {
    const teacherStore = TeacherStore.useContainer();

    return <div
        className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
        <TeacherSidebar/>
        <main className="flex flex-col w-full items-center h-full justify-center gap-6">
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
            <div className="w-full h-full gap-12">
                <Table className="font-medium border-1">
                    <TableCaption>
                        <div className={"w-full flex-row flex justify-between"}>
                            <ChevronLeftCircleIcon />
                            21/06/2025
                            <ChevronRightCircleIcon />
                        </div>

                    </TableCaption>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className={"text-center border-b-3"}>Student</TableHead>
                            <TableHead className={"text-center border-b-3"}>1^ hour</TableHead>
                            <TableHead className={"text-center border-b-3"}><div className={"flex-row flex justify-center"}>2^ hour<CopyIcon /></div></TableHead>
                            <TableHead className={"text-center border-b-3"}>3^ hour</TableHead>
                            <TableHead className={"text-center border-b-3"}>4^ hour</TableHead>
                            <TableHead className={"text-center border-b-3"}>5^ hour</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teacherStore.classStudents.map(student =>
                            <TableRow key={`studRow-${student.studentId}`}>
                                <TableCell className="font-medium border-e-1">{student.name} {student.surname}</TableCell>
                                <TableCell className="font-medium border-e-1 bg-green-600">P</TableCell>
                                <TableCell className="font-medium border-e-1 bg-red-600">A</TableCell>
                                <TableCell className="font-medium border-e-1 bg-orange-600">R</TableCell>
                                <TableCell className="font-medium border-e-1 bg-yellow-600">U</TableCell>
                                <TableCell className="font-medium border-e-1 bg-green-600">P</TableCell>

                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </main>
    </div>
}