import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { checkTurnstileToken } from "@/lib/turnstile.js";
import { db } from "@/db/index.js";
import { users } from "@/db/schema/users.js";
import { authMiddleware } from "@/middleware/auth.js";
import { students } from "@/db/schema/students.js";
import { teachers } from "@/db/schema/teachers.js";

/*
export const teachers = pgTable('teachers', {
	teacherId: serial('teacher_id').primaryKey(),
	userId: integer('user_id').notNull().unique().references(() => users.userId, { onDelete: 'cascade' }),
});
*/

const createAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  surname: z.string().min(1),
  role: z.enum(['student', 'teacher']),
  turnstileToken: z.string(),
});

export default async function () {
  const router = new Hono().basePath("/api/v1/admin");

  router.post("/create-account", zValidator('json', createAccountSchema), async (c) => {
		const { email, password, name, surname, role, turnstileToken } = c.req.valid('json');

		if (!await checkTurnstileToken(turnstileToken)) return c.json({ error: "Invalid Turnstile token" }, 400);

		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)
			.execute();

		if (existingUser.length > 0) return c.json({ error: "User already exists" }, 400);
		const userData = {
			email,
			password: await bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS),
			name,
			surname,
			role,
		};

		await db.insert(users).values(userData).execute();

		if (role === 'student') {
			await db.insert(users).values({
				...userData,
				role: 'parent'
			}).execute();

			await db.insert(students).values({
				userId: existingUser[0].userId,
				classId: null,
			}).execute();
		} else if (role === 'teacher') {
			await db.insert(teachers).values({
				userId: existingUser[0].userId,
			}).execute();
		}

		return c.json({ message: "Account created successfully" }, 201);
	});

  return router;
}
