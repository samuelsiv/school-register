"use server";

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthInfo } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	const authInfo = await getAuthInfo(request);
	if (!authInfo || !authInfo.authenticated || authInfo.role !== "student") {
		return NextResponse.redirect("/login");
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/home"],
}