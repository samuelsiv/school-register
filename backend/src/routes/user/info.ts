import { Hono } from "hono";
import { eq } from 'drizzle-orm';
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { authMiddleware } from "../../middleware/auth.js";
import { students } from "../../db/schema/students.js";
import { parentStudents } from "../../db/schema/parentStudents.js";

export default async function () {
	const router = new Hono().basePath("/api/v1/user");

	router.get("/info", async (c) => {
		const { userId } = c.get("user");
		const [ userFound ] = await db.select().from(users).where(eq(users.userId, userId)).limit(1);

		let assignedStudents: {
			studentId: number;
			classId: number | null;
		}[] = [];

		if (userFound.role === "parent") {
			assignedStudents = (await db
				.select({
					parentId: parentStudents.parentId,
					student: {
						studentId: students.studentId,
						classId: students.classId,
					},
				})
				.from(parentStudents)
				.innerJoin(students, eq(parentStudents.studentId, students.studentId))
				.where(eq(parentStudents.parentId, userId)))
				.map((entry) => entry.student);
		} else if (userFound.role === "student") {
			const studentEntry = (await db
				.select({
					studentId: students.studentId,
					classId: students.classId,
				})
				.from(students)
				.where(eq(students.userId, userId))
				.limit(1))
				.map((entry) => entry);
			
			assignedStudents = studentEntry.map((entry) => entry);
		}

		const { password: _, ...userInfo } = userFound;
		return c.json({
			success: true,
			user: userInfo,
			assignedStudents
		});
	});

	return router;
}
