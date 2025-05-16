import { Hono } from "hono";
import login from "../auth/login.js";

export default async function () {
	const router = new Hono().basePath("/api/v1/misc");

	router.get("/config", async (c) => {
		return c.json({
			turnstile: {
				siteKey: process.env.TURNSTILE_SITE_KEY
			},
			features: {
				login: true,
				forgotPassword: true,
			}
		});
	});

	return router;
}