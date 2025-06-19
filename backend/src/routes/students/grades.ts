import { Hono } from "hono";
import { db } from "@/db/index.js";
import { grades } from "@/db/schema/grades.js";
import { and, eq } from "drizzle-orm";
import { parentStudents } from "@/db/schema/parentStudents.js";
import {subjects} from "@/db/schema/subjects.js";
import {users} from "@/db/schema/users.js";
import {calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage} from "@/lib/average.js";
import { studentDataMiddleware } from "@/middleware/studentData.js";

export default async function () {
  const router = new Hono().basePath("/api/v1/students");

  router.use("/:studentId/grades", studentDataMiddleware);
  router.get("/:studentId/grades", async (c) => {
    const student = c.get("student");

    const allGrades = (await db
      .select({
        gradeId: grades.gradeId, subjectName: subjects.subjectName,
        studentId: grades.studentId, teacherId: grades.teacherId,
        subjectId: grades.subjectId, value: grades.value,
        weight: grades.weight, insertedAt: grades.insertedAt,
        comment: grades.comment, teacherName: users.name
      })
      .from(grades)
      .where(eq(grades.studentId, student.studentId))
      .innerJoin(subjects, eq(subjects.subjectId, grades.subjectId))
      .innerJoin(users, eq(users.userId, grades.teacherId))).map((grade) => {
        return {
          ...grade,
          value: parseFloat(grade.value),
          weight: parseInt(grade.weight)
        }
    });

    return c.json({ allGrades, average: calculateGeneralAverage(allGrades), averagesByDay: calculateAveragesByDay(allGrades), averagesBySubject: calculateAveragesBySubject(allGrades) });
  });

  return router;
}
