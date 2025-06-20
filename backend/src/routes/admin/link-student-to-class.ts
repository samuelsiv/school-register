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

const linkStudentSchema = z.object({
    studentId: z.number(),
    classId: z.number(),
});

export default async function () {
    const router = new Hono().basePath("/api/v1/admin");

    router.post("/link-student-to-class", zValidator('json', linkStudentSchema), async (c) => {
        const { studentId, classId } = c.req.valid('json');

        const existingClass = await db
            .select()
            .from(classes)
            .where(
                eq(classes.classId, classId),
            )
            .limit(1)
            .execute();

        if (existingClass.length == 0) return c.json({ error: "Class doesn't exist" }, 400);

        await db.update(students).set({
            classId: classId
        }).where(eq(students.studentId, studentId)).execute();

        return c.json({ message: "Student linked to class" }, 201);
    });

    return router;
}
