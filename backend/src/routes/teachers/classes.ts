import { Hono } from "hono";
import { db } from "@/db/index.js";
import { eq } from "drizzle-orm";
import { classes } from "@/db/schema/classes.js";
import { teacherClasses } from "@/db/schema/teacherClasses.js";

export default async function () {
  const router = new Hono().basePath("/api/v1/teachers");

  router.get("/classes", async (c) => {
    const user = c.get("user");

    const allClasses = await db
      .select({
        classId: classes.classId,
        className: classes.className,
      })
      .from(teacherClasses)
      .innerJoin(classes, eq(teacherClasses.classId, classes.classId))
      .where(eq(teacherClasses.teacherId, user.userId));

    return c.json({ allClasses });
  });

  return router;
}
