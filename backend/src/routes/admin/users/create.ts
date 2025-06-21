import { db } from "@/db/index";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";
import { User, users } from "@/db/schema/users";
import { insertSingleItem, querySingleItem } from "@/db/utils";
import { checkTurnstileToken } from "@/lib/turnstile";
import { authMiddleware } from "@/middleware/auth";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createAccountSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	username: z.string().min(1),
	name: z.string().min(1),
	surname: z.string().min(1),
	role: z.enum(["student", "teacher"]),
});

export default async function() {
	const router = new Hono().basePath("/api/v1/admin/users");

	router.post("/create", zValidator("json", createAccountSchema), async (c) => {
		const { email, password, username, name, surname, role } = c.req.valid("json");

		const existingUser = await querySingleItem<User>(
			users,
			[or(
				eq(users.username, username),
				eq(users.email, email),
			)]
		);

		if (existingUser) return c.json({ error: "User already exists" }, 400);

		const newUser = await insertSingleItem<User>(
			users,
			{
				username,
				email,
				password: await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS.toString() || "10")),
				name,
				surname,
				role,
			}
		);

		const roleInserts = {
			student: () => db.insert(students).values({
				userId: newUser.userId,
				classId: null,
			}),
			teacher: () => db.insert(teachers).values({
				userId: newUser.userId,
			}),
		} as const;

		if (role in roleInserts) {
			await roleInserts[role as keyof typeof roleInserts]().execute();
		}

		return c.json({ message: "Account created successfully" }, 201);
	});

	return router;
}
