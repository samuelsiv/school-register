import {db} from "@/db";
import {events} from "@/db/schema/events";
import {asc, eq} from "drizzle-orm";
import {Hono} from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students");

  router.get("/events", async (c) => {
    const classId = parseInt(c.req.param("classId"), 10);

    if (isNaN(classId)) {
      return c.json({error: "Invalid classId"}, 400);
    }

    // Fetch all events for the given classId
    const eventList = await db
      .select()
      .from(events)
      .where(eq(events.classId, classId))
      .orderBy(asc(events.eventHour));

    // Group events by studentId
    const groupedByStudent = eventList.reduce((acc, event) => {
      const studentId = event.studentId;
      if (!acc[studentId]) {
        acc[studentId] = [];
      }
      acc[studentId].push(event);
      return acc;
    }, {} as Record<number, typeof eventList>);

    return c.json({eventsByStudent: groupedByStudent});
  });

  return router;
}
