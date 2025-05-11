import {Hono} from "hono";

export default async function () {
    const router = new Hono().basePath("/api/v1/misc");

    router.get("/turnstile", async (c) => {
        return c.json({
            "site_key": process.env.TURNSTILE_SITE_KEY
        })
    })

    return router;
}