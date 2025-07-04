import {db} from "@/db";
import {events} from "@/db/schema/events";
import {and, eq} from "drizzle-orm";
import {Hono} from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students/:studentId/events");

  // DELETE /api/v1/teachers/classes/:classId/:studentId/events/:eventId
  router.delete("/:eventId", async (c) => {
    const classId = parseInt(c.req.param("classId"), 10);
    const studentId = parseInt(c.req.param("studentId"), 10);
    const eventId = parseInt(c.req.param("eventId"), 10);

    if (isNaN(classId) || isNaN(studentId) || isNaN(eventId)) {
      return c.json({error: "Invalid classId, studentId, or eventId"}, 400);
    }

    // Delete the event by eventId, classId, and studentId
    const result = await db
      .delete(events)
      .where(and(eq(events.eventId, eventId), eq(events.classId, classId), eq(events.studentId, studentId)));

    if (result.rowCount === 0) {
      return c.json({error: "Event not found"}, 404);
    }

    return c.json({message: "Event deleted successfully"});
  });

  return router;
}
