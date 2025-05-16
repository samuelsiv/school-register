declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      JWT_SECRET: string;
      TURNSTILE_SECRET: string;
      TURNSTILE_SITE_KEY: string;
      BCRYPT_SALT_ROUNDS: number;
    }
  }
}

export interface JwtData {
  userId: number;
  role: string;
  exp: number;
  nbf: number;
  iat: number;
}

declare module "hono" {
  interface ContextVariableMap {
    user: JwtData;
  }
}

export type TokenData = {
  userId: number,
  role: string
}