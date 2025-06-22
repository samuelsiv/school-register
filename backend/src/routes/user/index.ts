import { db } from "@/db";
import { parentStudents } from "@/db/schema/parentStudents";
import { students } from "@/db/schema/students";
import {teachers} from "@/db/schema/teachers";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
	const router = new Hono().basePath("/api/v1");

	router.get("/user", async (c) => {
		const { userId } = c.get("user");
		const [userFound] = await db.select().from(users).where(eq(users.userId, userId)).limit(1);
		if (!userFound) {
			return c.json({ success: false, error: "User not found" }, 404);
		}

		let assignedStudents: Array<{
			studentId: number;
			classId: number | null;
		}> = [];
		let teacherId: number | undefined = undefined;
		if (userFound.role === "parent") {
			assignedStudents = (await db
				.select({
					parentId: parentStudents.parentId,
					student: {
						studentId: students.studentId,
						classId: students.classId,
						name: users.name,
						surname: users.surname,
						username: users.username,
					},
				})
				.from(parentStudents)
				.innerJoin(students, eq(parentStudents.studentId, students.studentId))
				.innerJoin(users, eq(students.userId, users.userId))
				.where(eq(parentStudents.parentId, userId)))
				.map((entry) => entry.student);
		} else if (userFound.role === "student") {
			const studentEntry = (await db
				.select({
					studentId: students.studentId,
					classId: students.classId,
					name: users.name,
					surname: users.surname,
					username: users.username,
				})
				.from(students)
				.where(eq(students.userId, userId))
				.innerJoin(users, eq(students.userId, userId))
				.limit(1))
				.map((entry) => entry);

			assignedStudents = studentEntry.map((entry) => entry);
		} else if (userFound.role === "teacher") {
			teacherId = (await db.select({teacherId: teachers.teacherId})
					.from(teachers).where(eq(teachers.userId, userId)).limit(1)
			)[0]?.teacherId;
		}

		const { password: _, ...userInfo } = userFound;
		return c.json({
			success: true,
			user: userInfo,
			assignedStudents,
			teacherId,
		});
	});

	return router;
}
