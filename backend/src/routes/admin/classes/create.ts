import {db} from "@/db";
import {classes} from "@/db/schema/classes";
import {zValidator} from "@hono/zod-validator";
import {eq} from "drizzle-orm";
import {Hono} from "hono";
import {z} from "zod";

const createClassroomSchema = z.object({
  className: z.string(), coordinatorTeacherId: z.number(), schoolYear: z.string(),
});

export default async function() {
  const router = new Hono().basePath("/api/v1/admin/classes");

  router.post("/create", zValidator("json", createClassroomSchema), async (c) => {
    const {className, schoolYear, coordinatorTeacherId} = c.req.valid("json");

    const existingClass = await db
      .select()
      .from(classes)
      .where(
        eq(classes.className, className),
      )
      .limit(1)
      .execute();

    if (existingClass.length === 1) {
      return c.json({error: "Class already exists"}, 400);
    }

    await db.insert(classes).values({
      className, coordinatorTeacherId, schoolYear,
    }).returning();

    return c.json({message: "Class created successfully"}, 201);
  });

  return router;
}
