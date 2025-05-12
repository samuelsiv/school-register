import { NextRequest } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";

export const isLogged = async (
  request: NextRequest,
  options: {
    tokenName?: string;
    secretEnvVar?: string;
    fallbackSecret?: string;
  } = {}
) => {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
        return { authenticated: false, reason: "missing_token" };
    }

    return {
        authenticated: true,
        payload: null
    };
};