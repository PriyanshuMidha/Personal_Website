import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import authRoutes from "./modules/authRoutes.js";
import profileRoutes from "./modules/profileRoutes.js";
import projectRoutes from "./modules/projectRoutes.js";
import experienceRoutes from "./modules/experienceRoutes.js";
import achievementRoutes from "./modules/achievementRoutes.js";
import skillRoutes from "./modules/skillRoutes.js";
import educationRoutes from "./modules/educationRoutes.js";
import messageRoutes from "./modules/messageRoutes.js";
import uploadRoutes from "./modules/uploadRoutes.js";
import dashboardRoutes from "./modules/dashboardRoutes.js";
import activityRoutes from "./modules/activityRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use(requireAuth);
router.use("/dashboard", dashboardRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/experience", experienceRoutes);
router.use("/achievements", achievementRoutes);
router.use("/skills", skillRoutes);
router.use("/education", educationRoutes);
router.use("/messages", messageRoutes);
router.use("/uploads", uploadRoutes);
router.use("/activity", activityRoutes);

export default router;
