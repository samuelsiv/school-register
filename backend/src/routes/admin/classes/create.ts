import { db } from "@/db/index";
import { classes } from "@/db/schema/classes";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";
import { users } from "@/db/schema/users";
import { checkTurnstileToken } from "@/lib/turnstile";
import { authMiddleware } from "@/middleware/auth";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createClassroomSchema = z.object({
	className: z.string(), schoolYear: z.string(), coordinatorTeacherId: z.number(),
});

export default async function() {
	const router = new Hono().basePath("/api/v1/admin/classes");

	router.post("/create", zValidator("json", createClassroomSchema), async (c) => {
		const { className, schoolYear, coordinatorTeacherId } = c.req.valid("json");

		const existingClass = await db
			.select()
			.from(classes)
			.where(
				eq(classes.className, className),
			)
			.limit(1)
			.execute();

		if (existingClass.length == 1) { return c.json({ error: "Class already exists" }, 400); }

		await db.insert(classes).values({
			className, schoolYear, coordinatorTeacherId,
		}).returning().execute();

		return c.json({ message: "Class created successfully" }, 201);
	});

	return router;
}
