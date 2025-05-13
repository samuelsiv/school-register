"use server"

import { NextRequest } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";

export const isLogged = async (
  request: NextRequest
) => {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) return { authenticated: false, reason: "missing_token" };
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || ""));
        return {
            authenticated: true,
            payload: null
        };
    } catch (e) {
        return { authenticated: false, reason: "invalid_token" };
    }
};