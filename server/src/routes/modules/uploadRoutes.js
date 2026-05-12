import { Router } from "express";
import { uploadImage, uploadResume } from "../../controllers/uploadController.js";
import { imageUpload, resumeUpload } from "../../utils/upload.js";

const router = Router();

router.post("/image", imageUpload.single("image"), uploadImage);
router.post("/resume", resumeUpload.single("resume"), uploadResume);

export default router;

