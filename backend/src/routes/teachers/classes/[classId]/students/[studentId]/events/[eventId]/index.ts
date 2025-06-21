import { Hono } from "hono";
import { db } from "@/db/index.js";
import { events } from "@/db/schema/events.js";
import { and, eq } from "drizzle-orm";

export default async function () {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students/:studentId/events/:eventId");

  // GET /api/v1/teachers/classes/:classId/:studentId/events/:eventId
  router.get("/:eventId", async (c) => {
    const classId = parseInt(c.req.param("classId"));
    const studentId = parseInt(c.req.param("studentId"));
    const eventId = parseInt(c.req.param("eventId"));

    if (isNaN(classId) || isNaN(studentId) || isNaN(eventId)) {
      return c.json({ error: "Invalid classId, studentId, or eventId" }, 400);
    }

    // Fetch the event by eventId, classId, and studentId
    const event = await db
      .select()
      .from(events)
      .where(and(eq(events.eventId, eventId), eq(events.classId, classId), eq(events.studentId, studentId)))
      .limit(1);

    if (event.length === 0) {
      return c.json({ error: "Event not found" }, 404);
    }

    return c.json({ event: event[0] });
  });

  return router;
}