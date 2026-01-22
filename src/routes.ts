import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import authRoute from "./modules/auth/auth.routes"
import projectRoute from "./modules/projects/projects.routes"
import fileRoute from "./modules/data/data.routes"
import assistant from "./modules/assistant/assistant.routes"

export const router = Router();

router.use("/auth",authRoute)
router.use("/projects",authMiddleware,projectRoute)
router.use("/project",authMiddleware,fileRoute)
router.use("/assistant",assistant)

export default router