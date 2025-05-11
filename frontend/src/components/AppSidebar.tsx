"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar"
import {BabyIcon, ChevronDown, LayoutDashboardIcon, PersonStandingIcon} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboardIcon
    }
]

const children = [
    "Alex Johnson"
]
export function AppSidebar({activeItem, activeChild}: {activeItem: string, activeChild: string}) {
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
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    {activeChild}
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                                {children.sort((child, _) => (child == activeChild) ? 0 : children.indexOf(child)).map((child) =>
                                    <DropdownMenuItem key={child} >
                                        <span>{child}</span>
                                    </DropdownMenuItem>
                                )}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>YOUR CHILDREN</SidebarGroupLabel>
                    {children.map((item) => (
                        <SidebarMenuItem key={item}>
                            <SidebarMenuButton asChild isActive={activeChild == item}>
                                <a>
                                    <BabyIcon />
                                    <span>{item}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>
                <SidebarGroup>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={activeItem == item.url}>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
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
