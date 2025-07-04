import { db } from "@/db/index";
import { homeworks } from "@/db/schema/homeworks";
import {subjects} from "@/db/schema/subjects";
import { teachers } from "@/db/schema/teachers";
import { users } from "@/db/schema/users";
import {eq, sql} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/students/:studentId");

  router.get("/homeworks", async (c) => {
    const studentClass = c.get("class");
    if (!studentClass) { return c.json({ error: "You are not assigned to any class." }); }

    const entries = await db
      .select({
        createdAt: homeworks.createdAt,
        description: homeworks.description,
        dueDate: homeworks.dueDate,
        homeworkId: homeworks.homeworkId,
        subjectName: subjects.subjectName,
        teacherName: sql<string>`${users.surname} || ' ' || ${users.name}`.as("teacherName"),
        title: homeworks.title,
      })
      .from(homeworks)
      .where(eq(homeworks.classId, studentClass.classId))
      .innerJoin(subjects, eq(subjects.subjectId, homeworks.subjectId))
      .innerJoin(teachers, eq(teachers.teacherId, homeworks.teacherId))
      .innerJoin(users, eq(users.userId, teachers.userId));

    return c.json(entries);
  });

  return router;
}
