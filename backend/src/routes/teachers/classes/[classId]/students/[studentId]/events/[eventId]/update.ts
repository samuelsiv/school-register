import { Hono } from "hono";
import { db } from "@/db/index.js";
import { events } from "@/db/schema/events.js";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const updateEventSchema = z.object({
  eventDate: z.string().optional(),
  eventHour: z.number().min(0).max(23).optional(),
  eventType: z.string().optional(),
  eventDescription: z.string().optional(),
});

export default async function () {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students/:studentId/events/:eventId");

  // PATCH /api/v1/teachers/classes/:classId/:studentId/events/:eventId
  router.patch("/:eventId", zValidator("json", updateEventSchema), async (c) => {
    const classId = parseInt(c.req.param("classId"));
    const studentId = parseInt(c.req.param("studentId"));
    const eventId = parseInt(c.req.param("eventId"));
    const updates = c.req.valid("json");

    if (isNaN(classId) || isNaN(studentId) || isNaN(eventId)) {
      return c.json({ error: "Invalid classId, studentId, or eventId" }, 400);
    }

    // Update the event by eventId, classId, and studentId
    const result = await db
      .update(events)
      .set(updates)
      .where(and(eq(events.eventId, eventId), eq(events.classId, classId), eq(events.studentId, studentId)));

    if (result.rowCount === 0) {
      return c.json({ error: "Event not found" }, 404);
    }

    return c.json({ message: "Event updated successfully" });
  });

  return router;
}