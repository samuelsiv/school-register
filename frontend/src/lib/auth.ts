"use server"

import { NextRequest } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";

export const isLogged = async (
  request: NextRequest
): Promise<{
  role: "student" | "parent" | "teacher" | "admin" | null;
	authenticated: boolean;
} | null> => {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) throw new Error("No token found");
  try {
    const data = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || ""));
    return {
			role: data.payload.role as "student" | "parent" | "teacher" | "admin",
			authenticated: true,
		};
  } catch (e) {
    return {
			role: null,
			authenticated: false,
		};
	}
}
