import { createMiddleware } from "hono/factory";
import { db } from "@/db/index.js";
import { parentStudents } from "@/db/schema/parentStudents.js";
import { and, eq } from "drizzle-orm";
import { students, type Student } from "@/db/schema/students.js";
import { classes } from "@/db/schema/classes.js";

export const studentDataMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user");

  let student: Student | null = null;

  if (user.role === "parent") {
    const studentId = parseInt(c.req.param("studentId") as string);

    const dbResult = await db
      .select()
      .from(parentStudents)
      .where(and(
        eq(parentStudents.parentId, user.userId),
        eq(parentStudents.studentId, studentId),
      ));

    if (dbResult.length === 0) {
      return c.json({
        error: "You are not authorized to view this student's grades",
      }, 403);
    }

    const studentEntries = await db
        .select()
        .from(students)
        .where(eq(students.studentId, studentId));

    student = studentEntries[0];
  } else if (user.role === "student") {
    const dbResult = await db.select().from(students).where(eq(students.userId, user.userId));
    if (dbResult.length === 0) {
      return c.json({
        error: "You are not authorized to view this student's grades",
      }, 403);
    }

    student = dbResult[0];
  }

  if (!student) {
    return c.json({
      error: "Student not found"
    }, 404);  
  }
      
  const classEntries = await db
    .select()
    .from(classes)
    .where(eq(classes.classId,  student.studentId));

  c.set("class", classEntries.length <= 0 ? null : classEntries[0]);

  await next();
});
