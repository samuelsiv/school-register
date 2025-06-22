import { db } from "@/db";
import { events } from "@/db/schema/events";
import {zValidator} from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import {z} from "zod";

const createManyEventSchema = z.array(z.object({
    eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
    eventHour: z.number().min(0).max(23),
    eventType: z.enum(["present", "absence", "delay", "leave"]),
    eventDescription: z.string().optional(),
    studentId: z.number(),
    teacherId: z.number(),
    classId: z.number(),
}));

export default async function() {
    const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students/events");

    router.post("/createMany", zValidator("json", createManyEventSchema), async (c) => {
        const eventsBatch = c.req.valid("json");
        const classId = parseInt(c.req.param("classId"), 10);

        // Fetch all events for the given classId
        let eventList = await db
            .select()
            .from(events)
            .where(eq(events.classId, classId));
        const signatures1 = new Set(
            eventList.map((item) =>
                `${item.eventDate}|${item.eventHour}|${item.studentId}`,
            ),
        );

        const hasDuplicates = eventsBatch.some((item) =>
            signatures1.has(`${item.eventDate}|${item.eventHour}|${item.studentId}`),
        );

        if (hasDuplicates) {
            return c.json({ error: "Contains duplicates on eventDate, eventHour and studentId" }, 400);
        }

        const newEvents = await db.insert(events).values(eventsBatch).returning().onConflictDoNothing().execute();
        eventList = [...eventList, ...newEvents];

        // Group events by studentId
        const groupedByStudent = eventList.reduce((acc, event) => {
            const studentId = event.studentId;
            if (!acc[studentId]) {
                acc[studentId] = [];
            }
            acc[studentId].push(event);
            return acc;
        }, {} as Record<number, typeof eventList>);
        return c.json({ newEvents: groupedByStudent});
    });

    return router;
}
