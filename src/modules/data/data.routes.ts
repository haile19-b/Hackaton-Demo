import { Router } from "express";
import { dataController } from "./data.controller";
import { upload } from "../../config/multer";

const router = Router();

router.post("/upload",upload.single("file"),dataController.uploadFile)

export default router