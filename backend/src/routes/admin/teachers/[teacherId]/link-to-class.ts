import {db} from "@/db";
import {classes} from "@/db/schema/classes";
import {teacherClasses} from "@/db/schema/teacherClasses";
import {zValidator} from "@hono/zod-validator";
import {eq} from "drizzle-orm";
import {Hono} from "hono";
import {z} from "zod";

const linkTeacherSchema = z.object({
  classId: z.number(),
});

export default async function() {
  const router = new Hono().basePath("/api/v1/admin/teachers/:teacherId");

  router.post("/link-to-class", zValidator("json", linkTeacherSchema), async (c) => {
    const {classId} = c.req.valid("json");
    const teacherId = parseInt(c.req.param("teacherId"), 10);

    const existingClass = await db
      .select()
      .from(classes)
      .where(
        eq(classes.classId, classId),
      )
      .limit(1)
      .execute();

    if (existingClass.length === 0) {
      return c.json({error: "Class doesn't exist"}, 400);
    }

    await db.insert(teacherClasses).values({
      classId,
      teacherId,
    }).onConflictDoNothing().execute();

    return c.json({message: "Teacher linked to class"}, 201);
  });

  return router;
}
