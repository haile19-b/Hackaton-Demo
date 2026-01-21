import { Router } from "express";
import { dataController } from "./data.controller";
import { upload } from "../../config/multer";

const router = Router();

router.post("/:projectId/upload",upload.single("file"),dataController.uploadFile)
router.post("/:projectId/add-missing-data",dataController.addMissingData)

export default router