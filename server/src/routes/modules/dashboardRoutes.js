import { Router } from "express";
import { getAdminDashboardOverviewData, getAdminDashboardStats, getDashboard } from "../../controllers/dashboardController.js";

const router = Router();

router.get("/", getDashboard);
router.get("/overview", getAdminDashboardOverviewData);
router.get("/stats", getAdminDashboardStats);

export default router;
