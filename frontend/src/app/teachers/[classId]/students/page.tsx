"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {TeacherSidebar} from "@/components/TeacherSidebar";
import {AlertCircleIcon, ChevronRightIcon, UserCircleIcon, UserIcon} from "lucide-react";
import {Card} from "@/components/ui/card";
import TeacherStore from "@/stores/teacher";

export default function TeacherStudentsPage() {
  const teacherStore = TeacherStore.useContainer();

  return <div
    className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
    <TeacherSidebar/>
    <main className="flex flex-col w-full items-center h-full justify-center gap-6">
      <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
        <SidebarTrigger/>
        <div>
          <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight text-primary">
            Students
          </h1>
          <h2 className="scroll-m-20 text-xl align-center tracking-tight">Check out the class's student's list</h2>
        </div>
        <br/>
      </div>
      <div
        className="grid grid-rows-2 w-full h-full md:grid-rows-1 xl:grid-rows-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6 w-full justify-start">
          <div className="flex flex-row items-center gap-4 py-2 w-full justify-start">
            <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">Students</h2>
          </div>
          {teacherStore.classStudents.map(student =>
            <Card
              className={"flex flex-row items-center gap-4 px-2 py-2 w-full justify-start ring-sidebar-ring" + ((teacherStore.selectedStudent?.studentId == student.studentId) ? " ring-1" : "")}
              onClick={() => teacherStore.setSelectedStudent(student)}
              key={student.studentId}>
              <div className="flex flex-row items-center gap-4 px-2 py-2 w-full justify-start">
                <UserIcon/>
                <span className="text-lg font-semibold">{student.name} {student.surname}</span>
              </div>
              <ChevronRightIcon/>
            </Card>
          )}
        </div>
        <Card className="flex flex-col gap-6 w-full h-[80vh] justify-start">
          {teacherStore.selectedStudent == null &&
              <div className="w-full h-full flex align-center items-center justify-center flex-col gap-4">
                  <AlertCircleIcon size="36"/>
                  <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">No student selected</h2>
              </div>
          }
          {teacherStore.selectedStudent != null &&
              <div className="w-full h-full flex items-center flex-col gap-4">
                  <UserCircleIcon size={72}/>
                  <h1 className="text-3xl font-semibold">{teacherStore.selectedStudent.name} {teacherStore.selectedStudent.surname}</h1>
                  <h1 className="text-xl font-light">{teacherStore.selectedStudent.username}</h1>
                  <div className={"w-full flex justify-start px-4 flex-col gap-4 items-start"}>
                      <div className="flex flex-row gap-4">
                          <h1 className="text-2xl font-semibold">Class: {
                            teacherStore.teacherClasses.find(
                              classroom => teacherStore.classId == classroom.classId.toString()
                            )?.className || ""
                          } {
                            [teacherStore.schoolTeachers.find(
                              teacher => teacherStore.selectedStudentInfo?.student?.coordinatorId == teacher.teacherId
                            )].map(t => t ? `(${t.name} ${t.surname})` : "???")[0]
                          }</h1>
                      </div>
                      <h1 className="text-2xl font-semibold">Parents: </h1>
                      <div className="ms-12">
                        {teacherStore.selectedStudentInfo?.parents.map(parent =>
                          <li className="text-xl font-light text-start"
                              key={"parent" + parent.parentId}>{parent.name} {parent.surname} ({parent.email})</li>
                        )}
                        {teacherStore.selectedStudentInfo?.parents?.length == 0 &&
                            <h1 className="text-xl font-light text-start">None :/</h1>}
                      </div>
                      <h1 className="text-2xl font-semibold">Average: {teacherStore.selectedStudentInfo?.average ? teacherStore.selectedStudentInfo?.average : "no grades"}</h1>
                  </div>
              </div>
          }
        </Card>
      </div>
    </main>
  </div>
}