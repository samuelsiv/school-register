import axios from "axios";

export interface SiteVerifyResponse {
    success: boolean;
    "error-codes": string[];
    challenge_ts?: Date;
    hostname?: string;
    action?: string;
    cdata?: string;
}

export async function checkTurnstileToken(token: string): Promise<boolean> {
    const result = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        idempotency_key: crypto.randomUUID(),
    },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const outcome = (await result.data) as SiteVerifyResponse;
    return outcome.success;
}
