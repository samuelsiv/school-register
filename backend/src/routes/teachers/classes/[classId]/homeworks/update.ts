import { Hono } from "hono";
import { db } from "@/db/index";
import { events } from "@/db/schema/events";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {homeworks} from "@/db/schema/homeworks";

const updateHomeworkSchema = z.object({
  description: z.string(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Invalid date format"}),
  homeworkId: z.number(),
  subjectId: z.number(),
  title: z.string(),
});

export default async function () {
  const router = new Hono().basePath("/api/v1/teachers/classes/:classId/students");

  // PATCH /api/v1/teachers/classes/:classId/students/homeworks
  router.patch("/homeworks", zValidator("json", updateHomeworkSchema), async (c) => {
    const classId = parseInt(c.req.param("classId"), 10);
    const { title, dueDate, description, subjectId, homeworkId } = c.req.valid("json");

    if (isNaN(classId)) {
      return c.json({ error: "Invalid classId" }, 400);
    }

    const result = await db
      .update(homeworks)
      .set({
        description, dueDate, subjectId, title,
      })
      .where(and(eq(homeworks.classId, classId), eq(homeworks.homeworkId, homeworkId))).returning();

    if (result.length === 0) {
      return c.json({ error: "Homework not found" }, 404);
    }

    return c.json({ message: "Homework updated successfully", ...result });
  });

  return router;
}