"use server"

import {NextRequest} from "next/server";
import {redirect} from "next/navigation";
import {isLogged} from "@/lib/auth";

export async function GET(request: NextRequest) {
    const logged = await isLogged(request)
    if (!logged) {
        return new Response('', {
            status: 307,
            headers: { 'Set-Cookie': `schoolAuth=`, "Location": "/login" },
        })
    } else {
        redirect("/home")
    }
}