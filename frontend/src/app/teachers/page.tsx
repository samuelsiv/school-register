"use client"

import {Card} from "@/components/ui/card";
import {GraduationCapIcon, LogOutIcon} from "lucide-react";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import TeacherStore from "@/stores/teacher";

export default function HomePage() {
    const teacherStore = TeacherStore.useContainer();
    return <div
        className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
        <main className="flex flex-col w-full items-center justify-center gap-6">
            <div id="title" className="flex flex-row gap-12 w-full justify-center items-center">
                <div>
                    <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight">
                        Welcome, <span className="text-primary">{teacherStore.name || ""}!</span>
                    </h1>
                    <h2 className="scroll-m-20 text-xl align-center tracking-tight">Select which class you want to monitor</h2>
                </div>
                <br/>
            </div>

            <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                {teacherStore.teacherClasses.map(teacherClass => <Link href={`/teachers/${teacherClass.classId }`} key={teacherClass.classId}>
                    <Card className={"p-4 border-t-[2px] gap-2 items-center"}>
                    <GraduationCapIcon />
                    <h1 className="font-bold text-2xl">{teacherClass.className}</h1>
                    <h2 className="font-semibold text-xl">{teacherClass.studentCount} students</h2>
                    <h2 className="font-semibold text-l">Coordinator: {teacherClass.coordinator}</h2>
                </Card></Link>)}
            </div>
            <Button asChild onClick={() => {
                document.cookie = "auth_token=; Max-Age=1; Path=/";
                redirect("/login");
            }} className="mt-4">
                <div className="w-[40%]">
                    <LogOutIcon />
                    <a>Logout</a>
                </div>
            </Button>
        </main>
    </div>
}