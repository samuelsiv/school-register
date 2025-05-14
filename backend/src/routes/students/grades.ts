import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.js";
import { db } from "../../db/index.js";
import { grades } from "../../db/schema/grades.js";
import { eq } from "drizzle-orm";

export default async function () {
  const router = new Hono().basePath("/api/v1/students");

  router.get("/grades",  async (c) => {
    const user = c.get("user");
    const studentId = user.userId;

    const allGrades = await db
      .select()
      .from(grades)
      .where(eq(grades.studentId, studentId));

    return c.json({ allGrades });
  });

  return router;
}
