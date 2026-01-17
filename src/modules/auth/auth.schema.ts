import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  userName: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().optional(),
});