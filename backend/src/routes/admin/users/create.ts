import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { checkTurnstileToken } from "@/lib/turnstile.js";
import { db } from "@/db/index.js";
import { users } from "@/db/schema/users.js";
import { authMiddleware } from "@/middleware/auth.js";
import { students } from "@/db/schema/students.js";
import { teachers } from "@/db/schema/teachers.js";

const createAccountSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	username: z.string().min(1),
	name: z.string().min(1),
	surname: z.string().min(1),
	role: z.enum(['student', 'teacher'])
});

export default async function () {
	const router = new Hono().basePath("/api/v1/admin/users");

	router.post("/users", zValidator('json', createAccountSchema), async (c) => {
		const { email, password, username, name, surname, role } = c.req.valid('json');

		const existingUser = await db
			.select()
			.from(users)
			.where(
				or(
					eq(users.username, username),
					eq(users.email, email)
				)
			)
			.limit(1)
			.execute();

		if (existingUser.length == 1) return c.json({ error: "User already exists" }, 400);
		const userData = {
			username,
			email,
			password: await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS.toString() || '10')),
			name,
			surname,
			role,
		};

		const newUser = await db.insert(users).values(userData).returning().execute();

		if (role === 'student') {
			await db.insert(students).values({
				userId: newUser[0].userId,
				classId: null,
			}).execute();
		} else if (role === 'teacher') {
			await db.insert(teachers).values({
				userId: newUser[0].userId,
			}).execute();
		}

		return c.json({ message: "Account created successfully" }, 201);
	});

	return router;
}
