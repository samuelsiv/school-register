import { Hono } from "hono";
import { db } from "@/db/index.js";
import { events } from "@/db/schema/events.js";
import { and, eq } from "drizzle-orm";

export default async function () {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students/:studentId");

  router.get("/events", async (c) => {
    const classId = parseInt(c.req.param("classId"));
    const studentId = parseInt(c.req.param("studentId"));

    if (isNaN(classId) || isNaN(studentId)) {
      return c.json({ error: "Invalid classId or studentId" }, 400);
    }

    // Fetch all events for the given classId and studentId
    const eventList = await db
      .select()
      .from(events)
      .where(and(eq(events.classId, classId), eq(events.studentId, studentId)));

    return c.json({ events: eventList });
  });

  return router;
}