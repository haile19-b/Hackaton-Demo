import { Router } from "express";
import authRoute from "./modules/auth/auth.routes"
import projectRoute from "./modules/projects/projects.routes"
import fileRoute from "./modules/data/data.routes"
export const router = Router();

router.use("/auth",authRoute)
router.use("/project",projectRoute)
router.use("/file",fileRoute)

export default router