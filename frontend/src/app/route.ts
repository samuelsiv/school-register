"use server"

import {NextRequest} from "next/server";
import {redirect} from "next/navigation";
import {isLogged} from "@/lib/auth";

export async function GET(request: NextRequest) {
    if (await isLogged(request)) {
        return new Response('', {
            status: 307,
            headers: { 'Set-Cookie': `auth_token=`, "Location": "/login" },
        });
    }
    
    redirect("/home");
}