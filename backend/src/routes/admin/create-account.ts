import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { z } from "zod";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { checkTurnstileToken } from "../../lib/turnstile.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { authMiddleware } from "../../middleware/auth.js";

const createAccountSchema = z.object({

});

export default async function () {
    const router = new Hono().basePath("/api/v1/admin");

    router.post("/create-account", zValidator('json', createAccountSchema), async (c) => {

    });

    return router;
}
