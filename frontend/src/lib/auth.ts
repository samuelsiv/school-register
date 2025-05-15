"use server"

import { NextRequest } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";

export const isLogged = async (
  request: NextRequest
): Promise<boolean> => {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) return false;
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || ""));
        return true;
    } catch (e) {
        return false;
    }
};