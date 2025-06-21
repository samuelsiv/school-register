import { db } from "@/db/index";
import {classes} from "@/db/schema/classes";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";
import { users } from "@/db/schema/users";
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