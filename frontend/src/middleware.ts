import {NextFetchEvent, NextResponse} from 'next/server'
import type { NextRequest } from 'next/server'
import {isLogged} from "@/lib/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    const logged = await isLogged(request)
    if (!logged) return NextResponse.redirect(loginUrl)
    else return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/home"],
}