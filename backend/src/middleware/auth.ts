import type { JwtData } from "@/types.js";
import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";

export const authMiddleware = createMiddleware(async (c, next) => {
	const token = c.req.header("Authorization")?.split(" ")[1];
	if (!token) { return c.json({ error: "Unauthorized" }, 401); }

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtData;
		if (!decoded) { return c.json({ error: "Unauthorized" }, 401); }
		c.set("user", decoded);
		await next();
	} catch (err) {
		return c.json({ error: "Invalid token" }, 401);
	}
});
