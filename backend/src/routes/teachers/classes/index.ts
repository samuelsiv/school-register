import { db } from "@/db/index.js";
import { classes } from "@/db/schema/classes.js";
import {students} from "@/db/schema/students.js";
import { teacherClasses } from "@/db/schema/teacherClasses.js";
import { teachers } from "@/db/schema/teachers.js";
import { users } from "@/db/schema/users.js";
import { count, eq } from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/teachers/classes");

  router.get("", async (c) => {
    const user = c.get("user");
        
    // Poi, verifica le associazioni teacherClasses
    const teacherClassAssociations = await db
      .select()
      .from(teacherClasses)
      .where(eq(teacherClasses.teacherId, user.userId));
    
    console.log("Teacher class associations:", teacherClassAssociations);

    const allClasses = await db
      .select({
        classId: classes.classId,
        className: classes.className,
        coordinator: users.name,
        schoolYear: classes.schoolYear,
        studentCount: count(students.studentId),
      })
      .from(teacherClasses)
      .innerJoin(classes, eq(teacherClasses.classId, classes.classId))
      .innerJoin(teachers, eq(classes.coordinatorTeacherId, teachers.teacherId))
      .innerJoin(users, eq(teachers.userId, users.userId))
      .leftJoin(students, eq(students.classId, classes.classId))
      .where(eq(teacherClasses.teacherId, teacherId)) // Usa teacherId invece di user.userId
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