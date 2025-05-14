import { Hono } from "hono";
import { eq } from 'drizzle-orm';
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import {authMiddleware} from "../../middleware/auth.js";

export default async function () {
    const router = new Hono().basePath("/api/v1/user");

    router.get("/info", async (c) => {
        const { userId } = c.get("user");
        const [userFound] = await db.select().from(users).where(eq(users.userId, userId)).limit(1);
        if (!userFound) return c.json({ error: "User not found" }, 401);

        const { password: _, ...userInfo } = userFound;
        return c.json({
            success: true,
            user: userInfo
        });
    });

    return router;
}
