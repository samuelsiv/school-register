"use server"

import {NextRequest} from "next/server";
import {redirect} from "next/navigation";
import {getAuthInfo} from "@/lib/auth";

export async function GET(request: NextRequest) {
    if (!(await getAuthInfo(request))?.authenticated) {
        return new Response('', {
            status: 307,
            headers: {'Set-Cookie': `auth_token=`, "Location": "/login"},
        });
    }

    redirect("/teachers");
}