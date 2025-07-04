"use client"

import AdminStore from "@/stores/admin";

export default function AdminLayout({
                                      children,
                                    }: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminStore.Provider>{children}</AdminStore.Provider>
}