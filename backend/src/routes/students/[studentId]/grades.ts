import { db } from "@/db/index";
import { grades } from "@/db/schema/grades";
import { parentStudents } from "@/db/schema/parentStudents";
import {subjects} from "@/db/schema/subjects";
import {users} from "@/db/schema/users";
import {calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage} from "@/lib/average";
import { studentDataMiddleware } from "@/middleware/studentData";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/students/:studentId");

  router.get("/grades", async (c) => {
    const student = c.get("student");

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

    return c.json({ allGrades, average: calculateGeneralAverage(allGrades), averagesByDay: calculateAveragesByDay(allGrades), averagesBySubject: calculateAveragesBySubject(allGrades) });
  });

  return router;
}
