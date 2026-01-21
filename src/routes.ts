import { Router } from "express";
import authRoute from "./modules/auth/auth.routes"
import projectRoute from "./modules/projects/projects.routes"
import fileRoute from "./modules/data/data.routes"
import { authMiddleware } from "./middlewares/auth.middleware";
export const router = Router();

router.use("/auth",authRoute)
router.use("/projects",authMiddleware,projectRoute)
router.use("/project",authMiddleware,fileRoute)

export default router