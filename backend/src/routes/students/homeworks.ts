import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import {subjects} from "@/db/schema/subjects.js";
import { studentDataMiddleware } from "@/middleware/studentData.js";
import { homeworks } from "@/db/schema/homeworks.js";
import { db } from "@/db/index.js";
import { teachers } from "@/db/schema/teachers.js";

export default async function () {
  const router = new Hono().basePath("/api/v1/students");

  router.use("/:studentId/homeworks", studentDataMiddleware);
  router.get("/:studentId/homeworks", async (c) => {
    const studentClass = c.get("class");
    if (!studentClass) return c.json({ error: "You are not assigned to any class." });
    
    const entries = await db
      .select({
        title: homeworks.title,
        description: homeworks.description,
        createdAt: homeworks.createdAt,
        dueDate: homeworks.dueDate
      })
      .from(homeworks)
      .where(eq(homeworks.classId, studentClass.classId))
      .innerJoin(subjects, eq(subjects.subjectId, homeworks.subjectId))
      .innerJoin(teachers, eq(teachers.teacherId, homeworks.teacherId))
      
    return c.json(entries);
  });

  return router;
}
