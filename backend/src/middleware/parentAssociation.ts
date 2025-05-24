import { createMiddleware } from "hono/factory";
import { db } from "@/db/index.js";
import { parentStudents } from "@/db/schema/parentStudents.js";
import { and, eq } from "drizzle-orm";
import { students } from "@/db/schema/students.js";

export const parentAssociationMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user");

  if (user.role === "parent") {
    const studentId = parseInt(c.req.param("studentId") as string);

    const student = await db
      .select()
      .from(parentStudents)
      .where(and(
        eq(parentStudents.parentId, user.userId),
        eq(parentStudents.studentId, studentId),
      ));

    if (student.length === 0) {
      return c.json({
        error: "You are not authorized to view this student's grades",
      }, 403);
    }

    c.set("studentId", studentId);
  } else {
    const student = await db.select().from(students).where(eq(students.userId, user.userId));
    if (student.length === 0) {
      return c.json({
        error: "You are not authorized to view this student's grades",
      }, 403);
    }
    c.set("studentId", student[0].studentId);
  }

  await next();
});
