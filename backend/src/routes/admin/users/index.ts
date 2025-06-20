import { Hono } from "hono";
import { db } from "@/db/index.js";
import { users } from "@/db/schema/users.js";
import { students } from "@/db/schema/students.js";
import { teachers } from "@/db/schema/teachers.js";
import {classes} from "@/db/schema/classes.js";
import {eq} from "drizzle-orm";

export default async function () {
    const router = new Hono().basePath("/api/v1/admin/users");

    router.get("", async (c) => {
        const allUsers = await db
            .select({
                userId: users.userId,
                name: users.name,
                surname: users.surname,
                username: users.username,
                email: users.email,
                role: users.role,
                creationDate: users.creationDate,
                lastLoginDate: users.lastLoginDate,
            })
            .from(users);

        const studentRows = await db
            .select({
                userId: students.userId,
                studentId: students.studentId,
                classId: students.classId,
                className: classes.className
            })
            .from(students)
            .leftJoin(classes, eq(students.classId, classes.classId));

        const teacherRows = await db.select({userId: teachers.userId, teacherId: teachers.teacherId}).from(teachers);

        const studentMap = new Map(studentRows.map(s => [s.userId, {
            studentId: s.studentId,
            classId: s.classId,
            className: s.className
        }]));
        const teacherMap = new Map(teacherRows.map(t => [t.userId, t.teacherId]));

        const usersWithRoles = allUsers.map(u => {
            const studentInfo = studentMap.get(u.userId);
            return {
                ...u,
                studentId: studentInfo?.studentId || null,
                classId: studentInfo?.classId || null,
                className: studentInfo?.className || null,
                teacherId: teacherMap.get(u.userId) || null,
            };
        });

        return c.json({ users: usersWithRoles });
    });

    return router;
}