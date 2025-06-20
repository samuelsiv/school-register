import { db } from "@/db/index";
import { classes } from "@/db/schema/classes";
import { events } from "@/db/schema/events";
import { grades } from "@/db/schema/grades";
import { homeworks } from "@/db/schema/homeworks";
import { parentStudents } from "@/db/schema/parentStudents";
import { students } from "@/db/schema/students";
import { subjects } from "@/db/schema/subjects";
import { teacherClasses } from "@/db/schema/teacherClasses";
import { teachers } from "@/db/schema/teachers";
import { users } from "@/db/schema/users";
import { calculateAveragesByDay, calculateAveragesBySubject, calculateGeneralAverage } from "@/lib/average";
import { count, desc, eq } from "drizzle-orm";
import { Hono } from "hono";

export default async function() {
	const router = new Hono().basePath("/api/v1/admin/students/:studentId");
	router.get("/overview", async (c) => {
		const studentId = parseInt(c.req.param("studentId"));
		if (isNaN(studentId)) {
			return c.json({ error: "Invalid studentId " }, 400);
		}

		const studentResult = await db
			.select({
				studentId: students.studentId,
				userId: students.userId,
				classId: students.classId,
				coordinatorId: classes.coordinatorTeacherId,
				name: users.name,
				surname: users.surname,
				username: users.username,
				email: users.email,
			})
			.from(students)
			.where(eq(students.studentId, studentId))
			.innerJoin(users, eq(students.userId, users.userId))
			.leftJoin(classes, eq(students.classId, classes.classId));

		const student = studentResult[0];

		if (!student) {
			console.log("Student is falsy:", student);
			return c.json({ error: "Student not found " + studentId }, 404);
		}

		const parentsList = await db
			.select({
				parentId: parentStudents.parentId,
				name: users.name,
				surname: users.surname,
				email: users.email,
			})
			.from(parentStudents)
			.innerJoin(users, eq(parentStudents.parentId, users.userId))
			.where(eq(parentStudents.studentId, studentId))
			.execute();

		const allGrades = (await db
			.select({
				gradeId: grades.gradeId, subjectName: subjects.subjectName,
				studentId: grades.studentId, teacherId: grades.teacherId,
				subjectId: grades.subjectId, value: grades.value,
				weight: grades.weight, insertedAt: grades.insertedAt,
				comment: grades.comment, teacherName: users.name,
			})
			.from(grades)
			.where(eq(grades.studentId, student.studentId))
			.innerJoin(subjects, eq(subjects.subjectId, grades.subjectId))
			.innerJoin(users, eq(users.userId, grades.teacherId))).map((grade) => {
				return {
					...grade,
					value: parseFloat(grade.value),
					weight: parseInt(grade.weight),
				};
			});

		const studentEvents = await db
			.select()
			.from(events)
			.where(eq(events.studentId, studentId));

		const studentHomeworks = student.classId == null ? [] :
			await db
				.select()
				.from(homeworks)
				.where(eq(homeworks.classId, student.classId))
				.orderBy(desc(homeworks.createdAt));

		return c.json({
			student,
			parents: parentsList,
			allGrades,
			average: calculateGeneralAverage(allGrades),
			averagesByDay: calculateAveragesByDay(allGrades),
			averagesBySubject: calculateAveragesBySubject(allGrades),
			events: studentEvents,
			homeworks: studentHomeworks,
		});
	});

	return router;
}
