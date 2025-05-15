import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isLogged } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	if (!await isLogged(request)) {
		const loginUrl = request.nextUrl.clone();
		loginUrl.pathname = '/login';

		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/home"],
}