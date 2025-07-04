"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {BabyIcon, BookOpenCheckIcon, ChartAreaIcon, ClockIcon, LayoutDashboardIcon, LogOutIcon} from "lucide-react";
import Link from "next/link";
import {Student} from "@/types/student";
import UserStore from "@/stores/user";
import {redirect, usePathname} from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/student",
    icon: LayoutDashboardIcon
  },
  {
    title: "Today",
    url: "/student/today",
    icon: ClockIcon
  },
  {
    title: "Grades",
    url: "/student/grades",
    icon: ChartAreaIcon
  },
  {
    title: "Homeworks",
    url: "/student/homeworks",
    icon: BookOpenCheckIcon
  }
]

export function AppSidebar() {
  const userStore = UserStore.useContainer();
  const {open} = useSidebar();
  const activeItem = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader hidden={open}>
        <b className="text-primary">SR</b>
      </SidebarHeader>
      <SidebarHeader hidden={!open} className="text-start">
        <b className="text-primary px-2">School Register</b>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {userStore.isParent && <SidebarGroupLabel>YOUR CHILDREN</SidebarGroupLabel>}
          {userStore.managedStudents.map((student: Student) => (
            <SidebarMenuItem key={student.studentId} onClick={() => userStore.selectStudent(student)}>
              <SidebarMenuButton asChild
                                 isActive={userStore.selectedStudent?.studentId == student.studentId}>
                <a>
                  <BabyIcon/>
                  <span>{student.name} {student.surname}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
        <SidebarGroup>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="mb-2">
              <SidebarMenuButton asChild isActive={activeItem == item.url}
                                 className={(activeItem == item.url) ? "ring-1" : ""}>
                <Link href={(activeItem == item.url) ? "#" : item.url}>
                  <item.icon/>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
        <SidebarGroup/>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton asChild onClick={() => {
          document.cookie = "auth_token=; Max-Age=1; Path=/";
          redirect("/login");
        }}>
          <div>
            <LogOutIcon/>
            <a>Logout</a>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
