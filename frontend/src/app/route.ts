"use server"

import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getAuthInfo } from "@/lib/auth";

export async function GET(request: NextRequest) {
	const authInfo = await getAuthInfo(request);
	if (!authInfo || !authInfo.authenticated) {
		return new Response('', {
			status: 307,
			headers: { 'Set-Cookie': `auth_token=`, "Location": "/login" },
		});
	}
	if (authInfo.role == "student" || authInfo.role == "parent") {
		redirect("/student");
	} else {
		redirect("/teachers");
	}
}