import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().default("5000"),
  JWT_SECRET: z.string(),
  BASE_URL: z.string().default("http://localhost:5000"),
  NODE_ENV: z.string().default("development"),
  JWT_ACCESS_SECRET: z.string().default("access_secret"),
  JWT_REFRESH_SECRET: z.string().default("secret_secret"),
});

export const env = EnvSchema.parse(process.env);
