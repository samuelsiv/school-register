"use client"

import {SidebarTrigger} from "@/components/ui/sidebar";
import {useState} from "react";
import {AlertCircleIcon, ChevronRightIcon, UserCircleIcon, UserIcon} from "lucide-react";
import {Card} from "@/components/ui/card";
import {AdminSidebar} from "@/components/AdminSidebar";
import {CreateStudentDialog} from "@/components/dialog/CreateStudentDialog";
import AdminStore from "@/stores/admin";
import {NewUser} from "@/types/userInfo";
import {NewUserDialog} from "@/components/dialog/NewUserDialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function AdminStudentsPage() {
  const adminStore = AdminStore.useContainer();
  const [newUser, setNewUser] = useState<NewUser | null>(null)

  return <div
    className="text-foreground flex items-center p-3 gap-6 text-center w-full h-full">
    <AdminSidebar/>
    <main className="flex flex-col w-full items-center h-full justify-center gap-6">
      <div id="title" className="flex flex-row gap-12 w-full justify-between items-center">
        <SidebarTrigger/>
        <div>
          <h1 className="scroll-m-20 text-3xl font-extrabold align-center tracking-tight text-primary">
            Students
          </h1>
          <h2 className="scroll-m-20 text-xl align-center tracking-tight">Check out the school&apos;s student&apos;s list</h2>
        </div>
        <br/>
      </div>
      <div
        className="grid grid-rows-2 w-full h-full md:grid-rows-1 xl:grid-rows-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6 w-full justify-start">
          <div className="flex flex-row items-center gap-4 py-2 w-full justify-between">
            <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">Students</h2>
            <CreateStudentDialog classes={adminStore.classes} inserted={(user) => {
              window.location.reload()
              setNewUser(user)
            }}/>
            {newUser != null && <NewUserDialog user={newUser}/>}
          </div>
          {adminStore.students.map(student =>
            <Card
              className={"flex flex-row items-center gap-4 px-2 py-2 w-full justify-start ring-sidebar-ring" + ((adminStore.selectedUser?.studentId == student.studentId) ? " ring-1" : "")}
              onClick={() => adminStore.setSelectedUser(student)} key={"st" + student.studentId}>
              <div className="flex flex-row items-center gap-4  px-2 py-2 w-full justify-start">
                <UserIcon/>
                <span className="text-lg font-semibold">{student.name} {student.surname}</span>
                <span className="text-md font-light">{student.username}</span>
              </div>
              <ChevronRightIcon/>
            </Card>
          )}
        </div>
        <Card className="flex flex-col gap-6 w-full h-[80vh] justify-start">
          {adminStore.selectedUser == null &&
              <div className="w-full h-full flex align-center items-center justify-center flex-col gap-4">
                  <AlertCircleIcon size="36"/>
                  <h2 className="scroll-m-20 text-2xl tracking-tight font-bold">No student selected</h2>
              </div>
          }
          {adminStore.selectedUser != null && <div className="w-full h-full flex items-center flex-col gap-4">
              <UserCircleIcon size={72}/>
              <h1 className="text-3xl font-semibold">{adminStore.selectedUser.name} {adminStore.selectedUser.surname}</h1>
              <h1 className="text-xl font-light">{adminStore.selectedUser.username}</h1>
              <div className={"w-full flex justify-start px-4 flex-col gap-4 items-start"}>
                  <div className="flex flex-row gap-4">
                      <h1 className="text-2xl font-semibold">Class: {
                        adminStore.classes.find(
                          classroom => adminStore.selectedUserInfo?.student?.classId == classroom.classId
                        )?.className || ""
                      } {
                        [adminStore.teachers.find(
                          teacher => adminStore.selectedUserInfo?.student?.coordinatorId == teacher.teacherId
                        )].map(t => t ? `(${t.name} ${t.surname})` : "")[0]
                      }</h1>

                    {adminStore.selectedUserInfo?.student?.classId == null && <Select onValueChange={classroom => {
                      adminStore.assignClass(classroom)
                    }}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Classroom"/>
                        </SelectTrigger>
                        <SelectContent>
                          {adminStore.classes.map(classroom => <SelectItem value={classroom.classId.toString()}
                                                                           key={"cl-" + classroom.classId.toString()}>{classroom.className}</SelectItem>)}
                        </SelectContent>
                    </Select>}
                  </div>
                  <h1 className="text-2xl font-semibold">Parents: </h1>
                  <div className="ms-12">
                    {adminStore.selectedUserInfo?.parents.map(parent =>
                      <li className="text-xl font-light text-start"
                          key={"parent" + parent.parentId}>{parent.name} {parent.surname} ({parent.email})</li>
                    )}
                    {adminStore.selectedUserInfo?.parents?.length == 0 &&
                        <h1 className="text-xl font-light text-start">None :/</h1>}

                  </div>
                  <h1 className="text-2xl font-semibold">Average: {adminStore.selectedUserInfo?.average ? adminStore.selectedUserInfo?.average : "no grades"}</h1>
              </div>
          </div>}
        </Card>
      </div>
    </main>
  </div>
}