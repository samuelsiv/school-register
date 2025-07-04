"use client"

import UserStore from "@/stores/user"

export default function StudentLayout({
                                        children,
                                      }: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserStore.Provider>{children}</UserStore.Provider>
}