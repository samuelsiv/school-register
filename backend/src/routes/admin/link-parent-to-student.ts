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
import {parentStudents} from "@/db/schema/parentStudents.js";

const linkParentSchema = z.object({
    studentId: z.number(),
    parentId: z.number(),
});

export default async function () {
    const router = new Hono().basePath("/api/v1/admin");

    router.post("/link-parent-to-student", zValidator('json', linkParentSchema), async (c) => {
        const { studentId, parentId } = c.req.valid('json');

        const existingStudent = await db
            .select()
            .from(students)
            .where(
                eq(students.studentId, studentId),
            )
            .limit(1)
            .execute();

        if (existingStudent.length == 0) return c.json({ error: "Student doesn't exist" }, 400);

        const existingParent = await db
            .select()
            .from(users)
            .where(
                eq(users.userId, parentId),
            )
            .limit(1)
            .execute();

        if (existingParent.length == 0) return c.json({ error: "Parent doesn't exist" }, 400);

        await db.insert(parentStudents).values({
            parentId: parentId,
            studentId: studentId
        }).execute();

        return c.json({ message: "Parent linked to student" }, 201);
    });

    return router;
}
