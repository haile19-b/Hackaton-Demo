import { Router } from "express";
import authRoute from "./modules/auth/auth.routes"

export const router = Router();

router.use("/auth",authRoute)

export default router