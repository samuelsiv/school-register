import type { Class } from "./db/schema/classes";
import type { Student } from "./db/schema/students";

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

export interface IJwtData {
  userId: number;
  role: string;
  exp: number;
  nbf: number;
  iat: number;
}

declare module "hono" {
  interface ContextVariableMap {
    user: IJwtData;
    student: Student;
    class: Class | null; // student might not be enrolled
  }
}