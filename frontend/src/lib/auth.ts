"use server"

import {NextRequest} from "next/server";
import {jwtVerify} from "jose";
import {Role} from "@/types/auth";

export const getAuthInfo = async (
    request: NextRequest
): Promise<{
    role: Role | null;
    authenticated: boolean;
} | null> => {
    const token = request.cookies.get("auth_token")?.value;
    try {
        if (!token) throw new Error("No token found");
        const data = await jwtVerify<{
            role: Role;
        }>(token, new TextEncoder().encode(process.env.JWT_SECRET || "DO_NOT_USE_DEV_IN_PROD_UNSAFE_JWT_KEY"));
        return {
            role: data.payload.role,
            authenticated: true,
        };
    } catch {
        return {
            role: null,
            authenticated: false,
        };
    }
}
