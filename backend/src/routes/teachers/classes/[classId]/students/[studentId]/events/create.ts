import {db} from "@/db";
import {events} from "@/db/schema/events";
import {Student, students} from "@/db/schema/students";
import {Teacher, teachers} from "@/db/schema/teachers";
import {querySingleItem} from "@/db/utils";
import {zValidator} from "@hono/zod-validator";
import {eq} from "drizzle-orm";
import {Hono} from "hono";
import {z} from "zod";

const createEventSchema = z.object({
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}),
  eventDescription: z.string().optional(),
  eventHour: z.number().min(0).max(23),
  eventType: z.enum(["present", "absence", "delay", "leave"]),
});

export default async function() {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students/:studentId");

  router.post("/events", zValidator("json", createEventSchema), async (c) => {
    const {eventDate, eventHour, eventType, eventDescription} = c.req.valid("json");
    const classId = parseInt(c.req.param("classId"),10);
    const studentId = parseInt(c.req.param("studentId"), 10);
    const teacher = c.get("user");

    if (isNaN(classId) || isNaN(studentId)) {
      return c.json({error: "Invalid classId or studentId"}, 400);
    }

    // Verify if the teacher is assigned to the class
    const teacherAssigned = await querySingleItem<Teacher>(teachers, [eq(teachers.userId, teacher.userId)]);
    if (!teacherAssigned) {
      return c.json({error: "You are not authorized to create events for this class"}, 403);
    }

    // Verify if the student belongs to the class
    const studentEntry = await querySingleItem<Student>(students, [eq(students.studentId, studentId)]);

    if (!studentEntry || studentEntry.classId !== classId) {
      return c.json({error: "Student does not belong to this class"}, 404);
    }

    // Insert the event into the database
    await db.insert(events).values({
      studentId,
      teacherId: teacherAssigned.teacherId,
      eventDate: new Date(eventDate).toISOString(), // Convert Date to ISO string
      eventHour,
      eventType,
      eventDescription: eventDescription || null,
      classId,
    });

    return c.json({message: "Event created successfully"}, 201);
  });

  return router;
}