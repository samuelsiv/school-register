import { db } from "@/db/index.js";
import { classes } from "@/db/schema/classes.js";
import {students} from "@/db/schema/students.js";
import { teacherClasses } from "@/db/schema/teacherClasses.js";
import { teachers } from "@/db/schema/teachers.js";
import { users } from "@/db/schema/users.js";
import { count, eq } from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/teachers");

  router.get("/classes", async (c) => {
    const user = c.get("user");

    const allClasses = await db
      .select({
        classId: classes.classId,
        className: classes.className,
        schoolYear: classes.schoolYear,
        coordinator: users.name,
        studentCount: count(students.studentId),
      })
      .from(teacherClasses)
      .innerJoin(classes, eq(teacherClasses.classId, classes.classId))
      .innerJoin(teachers, eq(classes.coordinatorTeacherId, teachers.teacherId))
      .innerJoin(users, eq(teachers.userId, users.userId))
      .leftJoin(students, eq(students.classId, classes.classId))
      .where(eq(teacherClasses.teacherId, user.userId))
      .groupBy(
        classes.classId,
        classes.className,
        classes.schoolYear,
        users.name,
      );

    return c.json({ allClasses });
  });

  return router;
}
