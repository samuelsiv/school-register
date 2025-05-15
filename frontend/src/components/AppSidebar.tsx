"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar"
import {BabyIcon, ChartAreaIcon, ChevronDown, LayoutDashboardIcon, PersonStandingIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {useUserInfo} from "@/lib/data";
import {Student} from "@/types/Student";
const items = [
    {
        title: "Dashboard",
        url: "/home/dashboard",
        icon: LayoutDashboardIcon
    },
    {
        title: "Grades",
        url: "/home/grades",
        icon: ChartAreaIcon
    }
]

export function AppSidebar({activeItem, activeChild, onSelectChildAction}: {activeItem: string, activeChild: Student | undefined, onSelectChildAction: (student: Student) => void}) {
    const { userInfo, isLoading, isError } = useUserInfo()
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    } = useSidebar()
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader hidden={open}>
                <b>SR</b>
            </SidebarHeader>
            <SidebarHeader hidden={!open}>
                <b>School-Register</b>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>YOUR CHILDREN</SidebarGroupLabel>
                    {userInfo?.students?.map((student) => (
                        <SidebarMenuItem key={student.studentId} onClick={() => onSelectChildAction(student)}>
                            <SidebarMenuButton asChild isActive={activeChild == student}>
                                <a>
                                    <BabyIcon />
                                    <span>{student.studentName}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>
                <SidebarGroup>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={activeItem == item.url}>
                                <Link href={(activeItem == item.url) ? "#" : item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
