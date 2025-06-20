import { Hono } from "hono";
import { db } from "@/db/index.js";
import {eq, count, ne, isNotNull} from "drizzle-orm";
import { classes } from "@/db/schema/classes.js";
import { teacherClasses } from "@/db/schema/teacherClasses.js";
import { teachers } from "@/db/schema/teachers.js";
import { users } from "@/db/schema/users.js";
import {students} from "@/db/schema/students.js";

export default async function () {
    const router = new Hono().basePath("/api/v1/admin");

        router.get("/classes", async (c) => {
            const user = c.get("user");

            // Prima query: ottieni tutte le classi con i coordinatori
            const allClasses = await db
                .select({
                    classId: classes.classId,
                    className: classes.className,
                    schoolYear: classes.schoolYear,
                    coordinator: users.name,
                })
                .from(classes)
                .innerJoin(teachers, eq(classes.coordinatorTeacherId, teachers.teacherId))
                .innerJoin(users, eq(teachers.userId, users.userId));

            // Seconda query: ottieni tutti gli studenti con le loro informazioni
            const allStudents = await db
                .select({
                    classId: students.classId,
                    studentId: students.studentId,
                    userId: students.userId,
                    name: users.name,
                    surname: users.surname,
                    username: users.username,
                })
                .from(students)
                .innerJoin(users, eq(students.userId, users.userId))
                .where(isNotNull(students.classId)); // Solo studenti assegnati a una classe

            // Raggruppa gli studenti per classe
            const studentsByClass = allStudents.reduce((acc, student) => {
                if (!acc[student.classId!]) {
                    acc[student.classId!] = [];
                }
                acc[student.classId!].push({
                    studentId: student.studentId,
                    userId: student.userId,
                    name: student.name,
                    surname: student.surname,
                    username: student.username,
                });
                return acc;
            }, {} as Record<number, any[]>);

            // Combina le classi con i loro studenti
            const classesWithStudents = allClasses.map(cls => ({
                ...cls,
                students: studentsByClass[cls.classId] || []
            }));

            return c.json({ allClasses: classesWithStudents });
        });

    return router;
}