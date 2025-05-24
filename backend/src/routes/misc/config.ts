import { Hono } from "hono";

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
				demo: parseInt(process.env.DEMO ?? "0") === 1,
			}
		});
	});

	return router;
}