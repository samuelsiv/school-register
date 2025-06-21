import { db } from "@/db/index";
import {events} from "@/db/schema/events";
import { grades } from "@/db/schema/grades";
import { parentStudents } from "@/db/schema/parentStudents";
import {subjects} from "@/db/schema/subjects";
import {users} from "@/db/schema/users";
import {calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage} from "@/lib/average";
import { studentDataMiddleware } from "@/middleware/studentData";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/students/:studentId");

  router.get("/events", async (c) => {
    const student = c.get("student");

    const allEvents = await db
      .select({
        eventId: events.eventId, eventDate: events.eventDate,
        studentId: events.studentId, teacherId: events.teacherId,
        eventHour: events.eventHour, eventDescription: events.eventDescription,
        eventType: events.eventType, classId: events.classId,
        teacherName: users.name,
      })
      .from(events)
      .where(eq(events.studentId, student.studentId))
      .innerJoin(users, eq(users.userId, events.teacherId));

    return c.json({ allEvents });
  });

  return router;
}
