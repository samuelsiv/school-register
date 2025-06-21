import { db } from "@/db/index";
import {classes} from "@/db/schema/classes";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";
import { users } from "@/db/schema/users";
import { authMiddleware } from "@/middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { eq, or } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const linkStudentSchema = z.object({
    classId: z.number(),
});

export default async function() {
    const router = new Hono().basePath("/api/v1/admin/students/:studentId");

    router.post("/link-to-class", zValidator("json", linkStudentSchema), async (c) => {
        const { classId } = c.req.valid("json");
        const studentId = parseInt(c.req.param("studentId"));

        const existingClass = await db
            .select()
            .from(classes)
            .where(
                eq(classes.classId, classId),
            )
            .limit(1)
            .execute();

        if (existingClass.length == 0) { return c.json({ error: "Class doesn't exist" }, 400); }

        await db.update(students).set({
            classId,
        }).where(eq(students.studentId, studentId)).execute();

        return c.json({ message: "Student linked to class" }, 201);
    });

    return router;
}
