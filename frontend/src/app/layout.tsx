"use client";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/ThemeProvider";
import UserStore from "@/stores/user";
import {SidebarProvider} from "@/components/ui/sidebar";
import {Providers} from "@/app/providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background bg-gradient-to-b from-background to-muted`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Providers>
                <UserStore.Provider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </UserStore.Provider>
            </Providers>
        </ThemeProvider>
        </body>
        </html>
);
}
