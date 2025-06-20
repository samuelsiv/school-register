import { db } from "@/db/index.js";
import { classes } from "@/db/schema/classes.js";
import {events} from "@/db/schema/events.js";
import {grades} from "@/db/schema/grades.js";
import {homeworks} from "@/db/schema/homeworks.js";
import {parentStudents} from "@/db/schema/parentStudents.js";
import {students} from "@/db/schema/students.js";
import {subjects} from "@/db/schema/subjects.js";
import { teacherClasses } from "@/db/schema/teacherClasses.js";
import { teachers } from "@/db/schema/teachers.js";
import { users } from "@/db/schema/users.js";
import {calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage} from "@/lib/average.js";
import {count, desc, eq} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
    const router = new Hono().basePath("/api/v1/admin/students/:studentId");
    router.get("", async (c) => {
        const studentId = parseInt(c.req.param("studentId"));
        const teacher = c.get("user");

        if (isNaN(studentId)) {
            return c.json({ error: "Invalid studentId" }, 400);
        }

        const studentResult = await db
            .select({
                studentId: students.studentId,
                userId: students.userId,
                classId: students.classId,
                coordinatorId: classes.coordinatorTeacherId,
                name: users.name,
                surname: users.surname,
                username: users.username,
                email: users.email,
            })
            .from(students)
            .where(eq(students.studentId, studentId))
            .innerJoin(users, eq(students.userId, users.userId))
            .leftJoin(classes, eq(students.classId, classes.classId));

        const student = studentResult[0];

        if (!student) {
            console.log("Student is falsy:", student);
            return c.json({error: "Student not found " + studentId}, 404);
        }

        const parentsList = await db
            .select({
                parentId: parentStudents.parentId,
                name: users.name,
                surname: users.surname,
                email: users.email,
            })
            .from(parentStudents)
            .innerJoin(users, eq(parentStudents.parentId, users.userId))
            .where(eq(parentStudents.studentId, studentId))
            .execute();

        const allGrades = (await db
            .select({
                gradeId: grades.gradeId, subjectName: subjects.subjectName,
                studentId: grades.studentId, teacherId: grades.teacherId,
                subjectId: grades.subjectId, value: grades.value,
                weight: grades.weight, insertedAt: grades.insertedAt,
                comment: grades.comment, teacherName: users.name,
            })
            .from(grades)
            .where(eq(grades.studentId, student.studentId))
            .innerJoin(subjects, eq(subjects.subjectId, grades.subjectId))
            .innerJoin(users, eq(users.userId, grades.teacherId))).map((grade) => {
            return {
                ...grade,
                value: parseFloat(grade.value),
                weight: parseInt(grade.weight),
            };
        });

        const studentEvents = await db
            .select()
            .from(events)
            .where(eq(events.studentId, studentId));

        const studentHomeworks = student.classId == null ? [] :
            await db
                .select()
                .from(homeworks)
                .where(eq(homeworks.classId, student.classId))
                .orderBy(desc(homeworks.createdAt));

        const isCoordinator = teacher.userId === student.coordinatorId;

        const filteredGrades = isCoordinator ? allGrades : allGrades.filter((grade) => grade.teacherId === teacher.userId);

        return c.json({
            student,
            parents: parentsList,
            allGrades: filteredGrades,
            average: filteredGrades.length == 0 ? null : calculateGeneralAverage(filteredGrades),
            averagesByDay: filteredGrades.length == 0 ? null : calculateAveragesByDay(filteredGrades),
            averagesBySubject: filteredGrades.length == 0 ? null : calculateAveragesBySubject(filteredGrades),
            events: studentEvents,
            homeworks: studentHomeworks,
        });
    });

    return router;
}
