"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {ChartAreaIcon, LayoutDashboardIcon, LogOutIcon, UsersIcon} from "lucide-react";
import Link from "next/link";
import {redirect, usePathname} from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboardIcon
  },
  {
    title: "Students",
    url: "/admin/students",
    icon: ChartAreaIcon
  },
  {
    title: "Classrooms",
    url: "/admin/classrooms",
    icon: UsersIcon
  }
]

export function AdminSidebar() {
  const {open} = useSidebar();
  const activeItem = usePathname();
  //const {classId} = useParams<{ classId: string }>()
  //const properItems = items.map(item => {item.url = item.url.replace("[id]", classId); return item;})
  const properItems = items
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
          {properItems.map((item) => (
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
