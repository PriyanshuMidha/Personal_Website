import { Router } from "express";
import { getAdminDashboardStats, getDashboard } from "../../controllers/dashboardController.js";

const router = Router();

router.get("/", getDashboard);
router.get("/stats", getAdminDashboardStats);

export default router;
