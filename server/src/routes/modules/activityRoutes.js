import { Router } from "express";
import { getAdminActivity } from "../../controllers/activityController.js";

const router = Router();

router.get("/", getAdminActivity);

export default router;
