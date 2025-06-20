import { Hono } from "hono";
import { db } from "@/db/index.js";
import { eq, count } from "drizzle-orm";
import { classes } from "@/db/schema/classes.js";
import { teacherClasses } from "@/db/schema/teacherClasses.js";
import { teachers } from "@/db/schema/teachers.js";
import { users } from "@/db/schema/users.js";
import { students } from "@/db/schema/students.js";

export default async function () {
	const router = new Hono().basePath("/api/v1/admin/classes");

	router.get("", async (c) => {
		const allClasses = await db
			.select({
				classId: classes.classId,
				className: classes.className,
				schoolYear: classes.schoolYear,
				coordinator: users.name,
				students: students,
			})
			.from(classes)
			.innerJoin(teachers, eq(classes.coordinatorTeacherId, teachers.teacherId))
			.innerJoin(users, eq(teachers.userId, users.userId))
			.leftJoin(students, eq(students.classId, classes.classId))
			.groupBy(
				classes.classId,
				students.studentId,
				classes.className,
				classes.schoolYear,
				users.name
			);

		return c.json({ allClasses });
	});

	return router;
}