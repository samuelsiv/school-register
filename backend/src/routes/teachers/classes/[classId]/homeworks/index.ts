import { db } from "@/db";
import { events } from "@/db/schema/events";
import {homeworks} from "@/db/schema/homeworks";
import {subjects} from "@/db/schema/subjects";
import {teachers} from "@/db/schema/teachers";
import {users} from "@/db/schema/users";
import {desc, eq, sql} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
    const router = new Hono().basePath("/api/v1/teachers/classes/:classId");

    router.get("/homeworks", async (c) => {
        const classId = parseInt(c.req.param("classId"), 10);

        if (isNaN(classId)) {
            return c.json({ error: "Invalid classId" }, 400);
        }

        // Fetch all events for the given classId
        const homeworksList = await db
            .select({
              createdAt: homeworks.createdAt,
              description: homeworks.description,
              dueDate: homeworks.dueDate,
              homeworkId: homeworks.homeworkId,
              subjectId: homeworks.subjectId,
              subjectName: subjects.subjectName,
              teacherId: homeworks.teacherId,
              teacherName: sql<string>`${users.surname} || ' ' || ${users.name}`.as("teacherName"),
              title: homeworks.title,
            })
            .from(homeworks)
            .where(eq(homeworks.classId, classId))
          .innerJoin(teachers, eq(homeworks.teacherId, teachers.teacherId))
          .innerJoin(users, eq(teachers.userId, users.userId))
          .innerJoin(subjects, eq(homeworks.subjectId, subjects.subjectId))
          .orderBy(desc(homeworks.createdAt));

        return c.json({ homeworksList });
    });

    return router;
}
