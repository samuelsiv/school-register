import { Hono } from "hono";
import { eq } from 'drizzle-orm';
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import {authMiddleware} from "../../middleware/auth.js";
import {getTokenData} from "../../lib/token.js";
import {getCookie} from "hono/cookie";

export default async function () {
    const router = new Hono().basePath("/api/v1/user");
    router.use("*", authMiddleware);

    router.get("/info", async (c) => {
        const tokenData = getTokenData(getCookie(c, "schoolAuth") || "")
        const [userFound] = await db.select().from(users).where(eq(users.userId, tokenData.userId)).limit(1);

        if (!userFound) {
            return c.json({ error: "User not found" }, 401);
        }

        const { password: _, ...userInfo } = userFound;
        return c.json({
            success: true,
            user: userInfo
        });
    });

    return router;
}
