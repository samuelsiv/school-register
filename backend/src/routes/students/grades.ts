import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { db } from "../../db/index.js";
import { grades } from "../../db/schema/grades.js";
import { and, eq } from "drizzle-orm";
import { parentStudents } from "../../db/schema/parentStudents.js";
import {subjects} from "../../db/schema/subjects.js";
import {teachers} from "../../db/schema/teachers.js";
import {users} from "../../db/schema/users.js";
import {calculateAveragesByDay, calculateGeneralAverage} from "../../lib/average.js";

export default async function () {
  const router = new Hono().basePath("/api/v1/students");

  router.get("/:studentId/grades",  async (c) => {
    const user = c.get("user");

    let dbCondition = eq(grades.studentId, user.userId);
    
    if (user.role === "parent") {
      const studentId = parseInt(c.req.param("studentId") as string);

      const student = await db
        .select()
        .from(parentStudents)
        .where(and(
          eq(parentStudents.parentId, user.userId),
          eq(parentStudents.studentId, studentId)
        ));
      
      if (student.length === 0) return c.json({ error: "You are not authorized to view this student's grades" }, 403);
      
      dbCondition = eq(grades.studentId, studentId);
    }

    const allGrades: {
      gradeId: number, subjectName: string
      studentId: number, teacherId: number,
      subjectId: number, value: number,
      weight: number, insertedAt: string | null,
      comment: string | null, teacherName: string
    }[] = (await db
      .select({
        gradeId: grades.gradeId, subjectName: subjects.subjectName,
        studentId: grades.studentId, teacherId: grades.teacherId,
        subjectId: grades.subjectId, value: grades.value,
        weight: grades.weight, insertedAt: grades.insertedAt,
        comment: grades.comment, teacherName: users.name
      })
      .from(grades)
      .where(dbCondition)
      .innerJoin(subjects, eq(subjects.subjectId, grades.subjectId))
      .innerJoin(users, eq(users.userId, grades.teacherId))).map((grade) => {
        return {
          ...grade,
          value: parseFloat(grade.value),
          weight: parseInt(grade.weight)
        }
    });

    return c.json({ allGrades, average: calculateGeneralAverage(allGrades), averagesByDay: calculateAveragesByDay(allGrades) });
  });

  return router;
}
