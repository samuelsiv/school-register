import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/ThemeProvider";
import UserStore from "@/stores/user";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Component } from "lucide-react";
import { AppProps } from "next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserStore.Provider>
            <SidebarProvider>
              <Component {...pageProps} />
            </SidebarProvider>
          </UserStore.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
