import { db } from "@/db/index";
import { grades } from "@/db/schema/grades";
import {subjects} from "@/db/schema/subjects";
import {users} from "@/db/schema/users";
import {calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage} from "@/lib/average";
import {eq, sql} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/students/:studentId");

  router.get("/grades", async (c) => {
    const student = c.get("student");

    const allGrades = (await db
      .select({
        comment: grades.comment, gradeId: grades.gradeId,
        insertedAt: grades.insertedAt, studentId: grades.studentId,
        subjectId: grades.subjectId, subjectName: subjects.subjectName,
        teacherId: grades.teacherId,
        teacherName: sql<string>`${users.surname} || ' ' || ${users.name}`.as("teacherName"),
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

    return c.json({
      allGrades,
      average: calculateGeneralAverage(allGrades),
      averagesByDay: calculateAveragesByDay(allGrades), averagesBySubject: calculateAveragesBySubject(allGrades),
    });
  });

  return router;
}
