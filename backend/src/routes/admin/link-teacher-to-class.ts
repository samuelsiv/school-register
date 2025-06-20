import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { checkTurnstileToken } from "@/lib/turnstile.js";
import { db } from "@/db/index.js";
import { users } from "@/db/schema/users.js";
import { authMiddleware } from "@/middleware/auth.js";
import { students } from "@/db/schema/students.js";
import { teachers } from "@/db/schema/teachers.js";
import {classes} from "@/db/schema/classes.js";
import {teacherClasses} from "@/db/schema/teacherClasses.js";

const linkTeacherSchema = z.object({
    teacherId: z.number(),
    classId: z.number(),
});

export default async function () {
    const router = new Hono().basePath("/api/v1/admin");

    router.post("/link-teacher-to-class", zValidator('json', linkTeacherSchema), async (c) => {
        const { teacherId, classId } = c.req.valid('json');

        const existingClass = await db
            .select()
            .from(classes)
            .where(
                eq(classes.classId, classId),
            )
            .limit(1)
            .execute();

        if (existingClass.length == 0) return c.json({ error: "Class doesn't exist" }, 400);

        await db.insert(teacherClasses).values({
            classId: classId,
            teacherId: teacherId
        }).onConflictDoNothing().execute();

        return c.json({ message: "Teacher linked to class" }, 201);
    });

    return router;
}
