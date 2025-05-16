"use client"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup, SidebarGroupLabel,
	SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar"
import { BabyIcon, ChartAreaIcon, ChevronDown, LayoutDashboardIcon, PersonStandingIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUserInfo } from "@/lib/data";
import { Student } from "@/types/student";
import UserStore from "@/stores/user";
import { usePathname } from "next/navigation";

const items = [
	{
		title: "Dashboard",
		url: "/student",
		icon: LayoutDashboardIcon
	},
	{
		title: "Grades",
		url: "/student/grades",
		icon: ChartAreaIcon
	}
]

export function AppSidebar({ activeChild, onSelectChildAction }: { activeChild: Student | null, onSelectChildAction: (student: Student) => void }) {
	const userStore = UserStore.useContainer();
	const { open } = useSidebar();
	const activeItem = usePathname();

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
					{userStore.managedStudents.map((student: Student) => (
						<SidebarMenuItem key={student.studentId} onClick={() => onSelectChildAction(student)}>
							<SidebarMenuButton asChild isActive={activeChild == student}>
								<a>
									<BabyIcon />
									<span>{student.fullName}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarGroup>
				<SidebarGroup>
					{items.map((item) => (
						<SidebarMenuItem key={item.title} className="mb-2">
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
