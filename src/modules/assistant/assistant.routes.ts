import { Router } from "express";
import { assistantController } from "./assistant.controller";

const router = Router();

router.post("/:projectId/ask-function", assistantController.answerUserQuery);

export default router;
