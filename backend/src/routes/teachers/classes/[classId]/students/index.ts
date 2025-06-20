import { db } from "@/db/index";
import { students } from "@/db/schema/students";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId");

  router.get("/students", async (c) => {
    const classId = parseInt(c.req.param("classId"));
    if (isNaN(classId)) {
      return c.json({ error: "Invalid classId" }, 400);
    }

    const studentList = await db
      .select({
        studentId: students.studentId,
        userId: students.userId,
        classId: students.classId,
        name: users.name,
        surname: users.surname,
        username: users.username,
        email: users.email,
      })
      .from(students)
      .where(eq(students.classId, classId))
      .innerJoin(users, eq(students.userId, users.userId));

    return c.json({ students: studentList });
  });

  return router;
}
