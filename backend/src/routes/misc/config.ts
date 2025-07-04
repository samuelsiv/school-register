import {Hono} from "hono";

export default async function() {
  const router = new Hono().basePath("/api/v1/misc");

  router.get("/config", async (c) => {
    return c.json({
      features: {
        demo: parseInt(process.env.DEMO ?? "0", 10) === 1,
        forgotPassword: true,
        login: true,
      },
      turnstile: {
        siteKey: process.env.TURNSTILE_SITE_KEY,
      },
    });
  });

  return router;
}
