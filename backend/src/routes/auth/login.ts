import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { checkTurnstileToken } from "../../lib/turnstile.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password is required" }),
  captcha: z.string().min(6, { message: "Captcha is required" }),
});

export default async function () {
  const router = new Hono().basePath("/api/v1/auth");

  router.post("/login", zValidator('json', loginSchema), async (c) => {
    const { email, password, captcha } = await c.req.valid('json');
    
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
        role: userFound.role 
      },
      process.env.JWT_SECRET, 
      { expiresIn: 3600 }
    );
    
    const { password: _, ...userInfo } = userFound;
    return c.json({ 
      token,
      user: userInfo
    });
  });

  return router;
}
