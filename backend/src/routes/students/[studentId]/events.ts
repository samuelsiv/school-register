import { db } from "@/db/index";
import {events} from "@/db/schema/events";
import {users} from "@/db/schema/users";
import {eq, sql} from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/students/:studentId");

  router.get("/events", async (c) => {
    const student = c.get("student");

    const allEvents = await db
      .select({
        classId: events.classId, eventDate: events.eventDate,
        eventDescription: events.eventDescription, eventHour: events.eventHour,
        eventId: events.eventId, eventType: events.eventType,
        studentId: events.studentId, teacherId: events.teacherId,
        teacherName: sql<string>`${users.surname} || ' ' || ${users.name}`.as("teacherName"),
      })
      .from(events)
      .where(eq(events.studentId, student.studentId))
      .innerJoin(users, eq(users.userId, events.teacherId));

    return c.json({ allEvents });
  });

  return router;
}
