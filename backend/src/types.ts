declare global {
  namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
        REDIS_URL: string;
        PORT: string;
        JWT_SECRET: string;
        TURNSTILE_SECRET: string;
        TURNSTILE_SITE_KEY: string;
    }
  }
}