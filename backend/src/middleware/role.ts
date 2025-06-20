import { createMiddleware } from "hono/factory";

export const roleMiddleware = (allowedRoles: string[]) =>
  createMiddleware(async (c, next) => {
    const user = c.get("user");
    if (!user) { return c.json({ error: "Unauthorized" }, 401); }

    if (allowedRoles.includes("*")) {
      await next();
      return;
    }

    if (!allowedRoles.includes(user.role)) { return c.json({ error: "Forbidden" }, 403); }

    await next();
  });
