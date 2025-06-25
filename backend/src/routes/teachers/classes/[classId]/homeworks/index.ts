import { db } from "@/db";
import { events } from "@/db/schema/events";
import {homeworks} from "@/db/schema/homeworks";
import {asc, desc, eq} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
    const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students");

    router.get("/homeworks", async (c) => {
        const classId = parseInt(c.req.param("classId"), 10);

        if (isNaN(classId)) {
            return c.json({ error: "Invalid classId" }, 400);
        }

        // Fetch all events for the given classId
        const homeworksList = await db
            .select()
            .from(homeworks)
            .where(eq(homeworks.classId, classId))
            .orderBy(desc(homeworks.createdAt));

        return c.json({ homeworksList });
    });

    return router;
}
