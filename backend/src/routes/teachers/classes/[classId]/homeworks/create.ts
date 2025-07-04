import { db } from "@/db";
import {homeworks} from "@/db/schema/homeworks";
import {Teacher, teachers} from "@/db/schema/teachers";
import {teachersSubjects} from "@/db/schema/teacherSubjects";
import {querySingleItem} from "@/db/utils";
import {zValidator} from "@hono/zod-validator";
import {and, eq, sql} from "drizzle-orm";
import { Hono } from "hono";
import {z} from "zod";

const createHomeworkSchema = z.object({
    description: z.string(),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}),
    title: z.string(),
    teacherId: z.number(),
    subjectId: z.number(),
});

export default async function() {
    const router = new Hono().basePath("/api/v1/teachers/classes/:classId");

    router.put("/homeworks", zValidator("json", createHomeworkSchema), async (c) => {
        const {dueDate, description, title, teacherId, subjectId} = c.req.valid("json");
        const classId = parseInt(c.req.param("classId"), 10);
        const teacher = c.get("user");

        const teacherAssigned = await querySingleItem<Teacher>(teachers, [eq(teachers.userId, teacher.userId)]);
        if (!teacherAssigned) {
            return c.json({ error: "You are not authorized to create homeworks for this class" }, 403);
        }

        const subject = await querySingleItem<Teacher>(teachersSubjects, [
            and(
                eq(teachersSubjects.teacherId, teacherAssigned.teacherId),
                eq(teachersSubjects.subjectId, subjectId),
            ),
        ]);
        if (!subject) {
            return c.json({ error: "You are not authorized to create homeworks for this subjects" }, 403);
        }
        const newHomework = await db.insert(homeworks)
            .values({
                classId,
                createdAt: sql`NOW()`,
                description,
                dueDate,
                subjectId,
                teacherId,
                title,
            })
            .returning()
            .onConflictDoNothing()
            .execute();
        return c.json({ newHomework });
    });

    return router;
}
