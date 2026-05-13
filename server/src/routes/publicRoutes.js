import { Router } from "express";
import validate from "../middlewares/validate.js";
import { getPublicProfile } from "../controllers/profileController.js";
import {
  createContactMessage,
  getPublicHome,
  getPublicDashboardStats,
  getFeaturedProjects,
  getProjectBySlug,
  getPublicAchievements,
  getPublicEducation,
  getPublicExperience,
  getPublicProjects,
  getPublicSkills,
} from "../controllers/publicController.js";
import { getPublicActivity } from "../controllers/activityController.js";
import { contactSchema } from "../validators/contactValidators.js";

const router = Router();

router.get("/profile", getPublicProfile);
router.get("/home", getPublicHome);
router.get("/projects", getPublicProjects);
router.get("/projects/featured", getFeaturedProjects);
router.get("/projects/:slug", getProjectBySlug);
router.get("/experience", getPublicExperience);
router.get("/achievements", getPublicAchievements);
router.get("/skills", getPublicSkills);
router.get("/education", getPublicEducation);
router.get("/dashboard-stats", getPublicDashboardStats);
router.get("/activity", getPublicActivity);
router.post("/contact", validate(contactSchema), createContactMessage);

export default router;
