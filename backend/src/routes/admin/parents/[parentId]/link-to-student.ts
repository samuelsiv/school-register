import {db} from "@/db";
import {parentStudents} from "@/db/schema/parentStudents";
import {students} from "@/db/schema/students";
import {users} from "@/db/schema/users";
import {zValidator} from "@hono/zod-validator";
import {eq} from "drizzle-orm";
import {Hono} from "hono";
import {z} from "zod";

const linkParentSchema = z.object({
  studentId: z.number(),
});

export default async function() {
  const router = new Hono().basePath("/api/v1/admin/parents/:parentId");

  router.post("/link-to-student", zValidator("json", linkParentSchema), async (c) => {
    const {studentId} = c.req.valid("json");
    const parentId = parseInt(c.req.param("parentId"), 10);

    const existingStudent = await db
      .select()
      .from(students)
      .where(
        eq(students.studentId, studentId),
      )
      .limit(1)
      .execute();

    if (existingStudent.length == 0) {
      return c.json({error: "Student doesn't exist"}, 400);
    }

    const existingParent = await db
      .select()
      .from(users)
      .where(
        eq(users.userId, parentId),
      )
      .limit(1)
      .execute();

    if (existingParent.length == 0) {
      return c.json({error: "Parent doesn't exist"}, 400);
    }

    await db.insert(parentStudents).values({
      parentId,
      studentId,
    }).execute();

    return c.json({message: "Parent linked to student"}, 201);
  });

  return router;
}
