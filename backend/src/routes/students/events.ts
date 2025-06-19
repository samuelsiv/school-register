import { Hono } from "hono";
import { db } from "@/db/index.js";
import { grades } from "@/db/schema/grades.js";
import { and, eq } from "drizzle-orm";
import { parentStudents } from "@/db/schema/parentStudents.js";
import {subjects} from "@/db/schema/subjects.js";
import {users} from "@/db/schema/users.js";
import {calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage} from "@/lib/average.js";
import { studentDataMiddleware } from "@/middleware/studentData.js";
import {events} from "@/db/schema/events.js";

export default async function () {
  const router = new Hono().basePath("/api/v1/students");

  router.use("/:studentId/events", studentDataMiddleware);
  router.get("/:studentId/events", async (c) => {
    const student = c.get("student");

    const allEvents = await db
      .select({
        eventId: events.eventId, eventDate: events.eventDate,
        studentId: events.studentId, teacherId: events.teacherId,
        eventHour: events.eventHour, eventDescription: events.eventDescription,
        eventType: events.eventType, classId: events.classId,
        teacherName: users.name
      })
      .from(events)
      .where(eq(events.studentId, student.studentId))
      .innerJoin(users, eq(users.userId, events.teacherId));

    return c.json({ allEvents });
  });

  return router;
}
