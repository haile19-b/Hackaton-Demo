import { Router } from "express";
import authRoute from "./modules/auth/auth.routes"
import projectRoute from "./modules/projects/projects.routes"

export const router = Router();

router.use("/auth",authRoute)
router.use("/project",projectRoute)

export default router