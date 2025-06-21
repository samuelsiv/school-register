import { db } from "@/db/index.js";
import {classes} from "@/db/schema/classes.js";
import { students } from "@/db/schema/students.js";
import { teachers } from "@/db/schema/teachers.js";
import { users } from "@/db/schema/users.js";
import {eq} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
    const router = new Hono().basePath("/api/v1");

    router.get("/teachers", async (c) => {
        const allTeachers = await db
            .select({
                creationDate: users.creationDate,
                email: users.email,
                lastLoginDate: users.lastLoginDate,
                name: users.name,
                role: users.role,
                surname: users.surname,
                teacherId: teachers.teacherId,
                userId: users.userId,
                username: users.username,
            })
            .from(teachers)
            .innerJoin(users, eq(teachers.userId, users.userId));

        return c.json({ teachers: allTeachers });
    });

    return router;
}