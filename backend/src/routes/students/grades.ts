import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { db } from "../../db/index.js";
import { grades } from "../../db/schema/grades.js";
import { and, eq } from "drizzle-orm";
import { parentStudents } from "../../db/schema/parentStudents.js";

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

    const allGrades = await db
      .select()
      .from(grades)
      .where(dbCondition);

    return c.json({ allGrades });
  });

  return router;
}
