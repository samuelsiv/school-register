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
    
    // Prima, verifica se l'utente è un insegnante
    const teacherInfo = await db
      .select({
        teacherId: teachers.teacherId,
        userId: teachers.userId,
      })
      .from(teachers)
      .where(eq(teachers.userId, user.userId));
    
    console.log("Teacher info:", teacherInfo);
    
    if (teacherInfo.length === 0) {
      return c.json({ error: "User is not a teacher", allClasses: [] });
    }
    
    const teacherId = teacherInfo[0].teacherId;
    
    // Poi, verifica le associazioni teacherClasses
    const teacherClassAssociations = await db
      .select()
      .from(teacherClasses)
      .where(eq(teacherClasses.teacherId, teacherId));
    
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