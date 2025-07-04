"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {TeacherSidebar} from "@/components/TeacherSidebar";
import TeacherStore from "@/stores/teacher";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ChevronLeftCircleIcon, ChevronRightCircleIcon, CopyIcon, EditIcon} from "lucide-react";
import {getAbbreviation, getColor} from "@/types/eventType";
import {SchoolEvent} from "@/types/event";
import {useState} from "react";
import {ModifyEventDialog} from "@/components/dialog/ModifyEventDialog";
import {CopyEventsDialog} from "@/components/dialog/CopyEventsDialog";
import {EditHoursEventsDialog} from "@/components/dialog/EditHourEventsDialog";
import {AddHomeworkDialog} from "@/components/dialog/AddHomeworkDialog";
import {Homework} from "@/types/homework";
import HomeworkCard from "@/components/cards/homeworks/HomeworkCard";
import HomeworkExpandedCard from "@/components/cards/homeworks/HomeworkExpandedCard";

export default function TeacherTodayPage() {
    const teacherStore = TeacherStore.useContainer();
    const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
    const [copyHour, setCopyHour] = useState<number | null>(null);
    const [editHour, setEditHour] = useState<number | null>(null);
    const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null)

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
                            <ChevronLeftCircleIcon onClick={() => {
                                const currDate = new Date(teacherStore.selectedDate)
                                currDate.setDate(currDate.getDate() - 1)
                                teacherStore.setSelectedDate(currDate.toISOString().split("T")[0])
                            }}/>
                            {teacherStore.selectedDate.split("-").reverse().join("/")}
                            <ChevronRightCircleIcon onClick={() => {
                                const currDate = new Date(teacherStore.selectedDate)
                                currDate.setDate(currDate.getDate() + 1)
                                teacherStore.setSelectedDate(currDate.toISOString().split("T")[0])
                            }}/>
                        </div>

                    </TableCaption>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className={"text-center border-b-3"}>Student</TableHead>
                            {teacherStore.dayHours.map(hour => <TableHead className={"text-center border-b-3"} key={"hourint-" + hour}>
                                <div className={"flex-row flex justify-between"}>
                                    <br/>
                                    <p>{hour}^ hour</p>
                                    {teacherStore.noEventsHours.indexOf(hour) !== -1 &&
                                        <CopyIcon onClick={() => setCopyHour(hour)}/>
                                    }
                                    {teacherStore.noEventsHours.indexOf(hour) === -1 &&
                                        <EditIcon onClick={() => setEditHour(hour)}/>
                                    }
                                </div>
                            </TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teacherStore.tableStudents.map(({id, events}) =>
                            <TableRow key={`studRow-${id}`}>
                                <TableCell className="font-medium border-e-1">
                                    {[teacherStore.classStudents.find(stud => stud.studentId.toString() == id)]
                                        .map(stud => `${stud?.surname} ${stud?.name}`)[0]
                                    }
                                </TableCell>

                                {events.map(event =>
                                    <TableCell
                                        className={`font-medium border-e-1 ${getColor(event.eventType)}`}
                                        onClick={() => setSelectedEvent(event)}
                                        key={`event-${event.eventId}`}>
                                        {getAbbreviation(event.eventType)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {selectedEvent != null &&
                    <ModifyEventDialog event={selectedEvent} onDimiss={() => setSelectedEvent(null)} onSave={(t, d) => teacherStore.editEvent(selectedEvent, t, d)} />
                }
                { copyHour != null &&
                    <CopyEventsDialog onDimiss={() => setCopyHour(null)} onSave={desc => teacherStore.copyEvents(copyHour, desc)} />
                }
                { editHour != null &&
                    <EditHoursEventsDialog onDimiss={() => setEditHour(null)} onSave={desc => teacherStore.editHourEvent(editHour, desc)} />
                }
                <div className="flex flex-row justify-between gap-6 w-full mt-8">
                    <div />
                    <h2 className="scroll-m-20 text-2xl align-center tracking-tight">Homeworks</h2>
                    <AddHomeworkDialog
                        teacherId={teacherStore.teacherId || 0}
                        classId={parseInt(teacherStore.classId!.toString(), 10) || 0}
                        subjects={teacherStore.assignedSubjects || []}
                        onCreate={() => {}}
                    />
                </div>
                <div className="grid grid-rows-2 grid-cols-3 gap-12 w-full">
                    { selectedHomework == null && teacherStore.todayHomeworks.map((homework: Homework) => <HomeworkCard homework={homework} key={"hw-" + homework.homeworkId} onArrowClick={() => {
                        setSelectedHomework(homework)
                    }}/>)}
                    {(selectedHomework != null) && <HomeworkExpandedCard homework={selectedHomework} goBack={() => setSelectedHomework(null)} /> }
                </div>
            </div>
        </main>
    </div>
}