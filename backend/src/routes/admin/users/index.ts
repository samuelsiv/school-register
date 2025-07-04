import {db} from "@/db";
import {classes} from "@/db/schema/classes";
import {students} from "@/db/schema/students";
import {teachers} from "@/db/schema/teachers";
import {users} from "@/db/schema/users";
import {eq} from "drizzle-orm";
import {Hono} from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/admin");

  router.get("/users", async (c) => {
    const allUsers = await db
      .select({
        creationDate: users.creationDate,
        email: users.email,
        lastLoginDate: users.lastLoginDate,
        name: users.name,
        role: users.role,
        surname: users.surname,
        userId: users.userId,
        username: users.username,
      })
      .from(users);

    const studentRows = await db
      .select({
        classId: students.classId,
        className: classes.className,
        studentId: students.studentId,
        userId: students.userId,
      })
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.classId));

    const teacherRows = await db.select({userId: teachers.userId, teacherId: teachers.teacherId}).from(teachers);

    const studentMap = new Map(studentRows.map((s) => [s.userId, {
      classId: s.classId,
      className: s.className,
      studentId: s.studentId,
    }]));
    const teacherMap = new Map(teacherRows.map((t) => [t.userId, t.teacherId]));

    const usersWithRoles = allUsers.map((u) => {
      const studentInfo = studentMap.get(u.userId);
      return {
        ...u,
        classId: studentInfo?.classId || null,
        className: studentInfo?.className || null,
        studentId: studentInfo?.studentId || null,
        teacherId: teacherMap.get(u.userId) || null,
      };
    });

    return c.json({users: usersWithRoles});
  });

  return router;
}
