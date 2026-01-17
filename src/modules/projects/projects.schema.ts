import { z } from "zod";

export const CreateProjectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional()
});

export const UpdateProjectSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED"]).optional()
});
