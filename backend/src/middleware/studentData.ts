import { Class, classes } from "@/db/schema/classes";
import { parentStudents } from "@/db/schema/parentStudents";
import { students, type Student } from "@/db/schema/students";
import { querySingleItem } from "@/db/utils";
import { and, eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";

export const studentDataMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user");
  let idToQuery: number;
  let queryField: "studentId" | "userId";

  if (user.role === "parent") {
    const studentId = parseInt(c.req.param("studentId") as string, 10);
    if (isNaN(studentId)) {
      return c.json({
        error: "Invalid student ID",
      }, 400);
    }

    // Check if parent is authorized to view this student
    const combination = await querySingleItem<{
      parentId: number;
      studentId: number;
    } | null>(
      parentStudents,
      [and(
        eq(parentStudents.parentId, user.userId),
        eq(parentStudents.studentId, studentId),
      )],
    );

    if (!combination) {
      return c.json({
        error: "You are not authorized to view this student",
      }, 403);
    }

    idToQuery = studentId;
    queryField = "studentId";
  } else if (user.role === "student") {
    idToQuery = user.userId;
    queryField = "userId";
  } else {
    return c.json({
      error: "Missing permission",
    }, 403);
  }

  const student = await querySingleItem<Student | null>(
    students,
    [eq(students[queryField], idToQuery)],
  );

  if (!student) {
    return c.json({
      error: "Student not found",
    }, 404);
  }

  c.set("student", student);

  if (student.classId) {
    const classEntry = await querySingleItem<Class | null>(
      classes,
      [eq(classes.classId, student.classId)],
    );
    c.set("class", classEntry);
  } else {
    c.set("class", null);
  }

  return await next();
});
