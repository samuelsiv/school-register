import { db } from "@/db/index";
import { classes } from "@/db/schema/classes";
import {events} from "@/db/schema/events";
import {grades} from "@/db/schema/grades";
import {homeworks} from "@/db/schema/homeworks";
import {parentStudents} from "@/db/schema/parentStudents";
import {students} from "@/db/schema/students";
import {subjects} from "@/db/schema/subjects";
import { teacherClasses } from "@/db/schema/teacherClasses";
import { teachers } from "@/db/schema/teachers";
import { users } from "@/db/schema/users";
import {calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage} from "@/lib/average";
import {desc, eq, sql} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
    const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students");
    router.get("/:studentId", async (c) => {
        const studentId = parseInt(c.req.param("studentId"), 10);
        const teacher = c.get("user");

        if (isNaN(studentId)) {
            return c.json({ error: "Invalid studentId" }, 400);
        }

        const teacherQuery = (await db.select({
          email: users.email,
          name: users.name,
          surname: users.surname,
          teacherId: teachers.teacherId,
          userId: teachers.userId,
          username: users.username,
        }).from(teachers)
            .where(eq(teachers.userId, teacher.userId))
            .innerJoin(users, eq(teachers.userId, users.userId))
            .execute());

        const teacherData = teacherQuery.at(0);
        if (!teacherData) { return c.json({ error: "Teacher not found" }, 404); }

        const studentResult = await db
            .select({
              classId: students.classId,
              coordinatorId: classes.coordinatorTeacherId,
              email: users.email,
              name: users.name,
              studentId: students.studentId,
              surname: users.surname,
              userId: students.userId,
              username: users.username,
            })
            .from(students)
            .where(eq(students.studentId, studentId))
            .innerJoin(users, eq(students.userId, users.userId))
            .leftJoin(classes, eq(students.classId, classes.classId));

        const student = studentResult[0];

        if (!student) { return c.json({error: "Student not found " + studentId}, 404); }
        const parentsList = await db
            .select({
              email: users.email,
              name: users.name,
              parentId: parentStudents.parentId,
              surname: users.surname,
            })
            .from(parentStudents)
            .innerJoin(users, eq(parentStudents.parentId, users.userId))
            .where(eq(parentStudents.studentId, studentId))
            .execute();

        const allGrades = (await db
            .select({
              comment: grades.comment, gradeId: grades.gradeId,
              insertedAt: grades.insertedAt, studentId: grades.studentId,
              subjectId: grades.subjectId, subjectName: subjects.subjectName,
              teacherId: grades.teacherId, teacherName: sql<string>`${users.surname} || ' ' || ${users.name}`.as("teacherName"),
              value: grades.value, weight: grades.weight,
            })
            .from(grades)
            .where(eq(grades.studentId, student.studentId))
            .innerJoin(subjects, eq(subjects.subjectId, grades.subjectId))
            .innerJoin(users, eq(users.userId, grades.teacherId))).map((grade) => {
            return {
                ...grade,
                value: parseFloat(grade.value),
                weight: parseInt(grade.weight, 10),
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

        const isCoordinator = teacherData.teacherId === student.coordinatorId;

        const filteredGrades =
          isCoordinator
            ? allGrades
            : allGrades.filter((grade) => grade.teacherId === teacherData.teacherId);

        return c.json({
          allGrades: filteredGrades,
          average: filteredGrades.length === 0 ? null : calculateGeneralAverage(filteredGrades),
          averagesByDay: filteredGrades.length === 0 ? null : calculateAveragesByDay(filteredGrades),
          averagesBySubject: filteredGrades.length == 0 ? null : calculateAveragesBySubject(filteredGrades),
          events: studentEvents,
          homeworks: studentHomeworks,
          parents: parentsList,
          student,
        });
    });

    return router;
}
