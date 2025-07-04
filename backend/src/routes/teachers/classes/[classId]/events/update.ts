import {db} from "@/db";
import {events} from "@/db/schema/events";
import {zValidator} from "@hono/zod-validator";
import {and, eq} from "drizzle-orm";
import {Hono} from "hono";
import {z} from "zod";

const updateEventSchema = z.object({
  eventDate: z.string(),
  eventHour: z.number().min(0).max(23),
  eventDescription: z.string(),
});

export default async function() {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students");

  // PATCH /api/v1/teachers/classes/:classId/students/events
  router.patch("/events", zValidator("json", updateEventSchema), async (c) => {
    const classId = parseInt(c.req.param("classId"), 10);
    const {eventDescription, eventHour, eventDate} = c.req.valid("json");

    if (isNaN(classId)) {
      return c.json({error: "Invalid classId"}, 400);
    }

    // Update the event by eventId, classId, and studentId
    const result = await db
      .update(events)
      .set({eventDescription})
      .where(and(eq(events.classId, classId), eq(events.eventDate, eventDate), eq(events.eventHour, eventHour))).returning();

    /*if (result.rowCount === 0) {
      return c.json({ error: "Event not found" }, 404);
    }*/

    return c.json({message: "Events updated successfully", ...result});
  });

  return router;
}
