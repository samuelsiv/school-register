import { db } from "@/db/index";
import { users } from "@/db/schema/users";
import { checkTurnstileToken } from "@/lib/turnstile";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import {
  setCookie,
} from "hono/cookie";
import jwt from "jsonwebtoken";
import { z } from "zod";
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password is required" }),
  captcha: z.string().min(6, { message: "Captcha is required" }),
});

export default async function() {
  const router = new Hono().basePath("/api/v1/auth");

  router.post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password, captcha } = c.req.valid("json");

    const captchaValid = await checkTurnstileToken(captcha);
    if (!captchaValid) {
      return c.json({ error: "Invalid captcha" }, 400);
    }

    const [userFound] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!userFound) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);
    if (!passwordMatch) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    await db
      .update(users)
      .set({ lastLoginDate: new Date() })
      .where(eq(users.userId, userFound.userId));

    const token = jwt.sign(
      {
        userId: userFound.userId,
        role: userFound.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
    );

    const { password: _, ...userInfo } = userFound;
    setCookie(c, "auth_token", token, {
      expires: new Date(Date.now() + 3600 * 1000),
    });
    return c.json({
      token,
      success: true,
      user: userInfo,
    });
  });

  return router;
}
