import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password is required" }),
  captcha: z.string().min(6, { message: "Captcha is required" }),
});

export default async function () {
  const router = new Hono().basePath("/api/v1/auth");

  router.post("/login", zValidator('json', loginSchema), async (c) => {
    const body = await c.req.valid('json');

    /* wip */

    return c.json({  });
  });

  return router;
}
