import jwt from "jsonwebtoken";
import type {TokenData} from "../types.js";

export const getTokenData = (authorizationToken: string) => jwt.decode(
    authorizationToken, {
        json: true, complete: true
    })?.payload as TokenData

export const generateToken = (data: TokenData) => jwt.sign(
    data,
    process.env.JWT_SECRET,
    { expiresIn: 3600 }
)
