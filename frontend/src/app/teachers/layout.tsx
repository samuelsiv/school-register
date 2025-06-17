"use client"

import TeacherStore from "@/stores/teacher";

export default function TeacherLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <TeacherStore.Provider>{children}</TeacherStore.Provider>
}