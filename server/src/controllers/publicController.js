import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { projectService } from "../services/projectService.js";
import { experienceService } from "../services/experienceService.js";
import { achievementService } from "../services/achievementService.js";
import { skillService } from "../services/skillService.js";
import { educationService } from "../services/educationService.js";
import { createMessage } from "../services/contactService.js";
import { getDashboardStats, getPublicHomeData } from "../services/dashboardService.js";

export const getPublicProjects = asyncHandler(async (_req, res) => {
  const projects = await projectService.listPublicSummary();
  sendSuccess(res, 200, "Projects fetched", projects);
});

export const getFeaturedProjects = asyncHandler(async (_req, res) => {
  const projects = await projectService.listFeaturedSummary();
  sendSuccess(res, 200, "Featured projects fetched", projects);
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await projectService.getPublicBySlug(req.params.slug);
  sendSuccess(res, 200, "Project fetched", project);
});

export const getPublicExperience = asyncHandler(async (_req, res) => {
  const experience = await experienceService.listPublic();
  sendSuccess(res, 200, "Experience fetched", experience);
});

export const getPublicAchievements = asyncHandler(async (_req, res) => {
  const achievements = await achievementService.listPublic();
  sendSuccess(res, 200, "Achievements fetched", achievements);
});

export const getPublicSkills = asyncHandler(async (_req, res) => {
  const skills = await skillService.listPublic();
  sendSuccess(res, 200, "Skills fetched", skills);
});

export const getPublicEducation = asyncHandler(async (_req, res) => {
  const education = await educationService.listPublic();
  sendSuccess(res, 200, "Education fetched", education);
});

export const createContactMessage = asyncHandler(async (req, res) => {
  const result = await createMessage(req.body);
  const { notification } = result;

  let responseMessage = "Message sent successfully.";

  if (notification?.skipped) {
    responseMessage = "Message saved, but contact email notifications are not configured.";
  } else if (notification?.failed) {
    responseMessage = "Message saved, but email notification delivery failed.";
  }

  sendSuccess(res, 201, responseMessage, result);
});

export const getPublicHome = asyncHandler(async (_req, res) => {
  const data = await getPublicHomeData();
  sendSuccess(res, 200, "Public home fetched", data);
});

export const getPublicDashboardStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats({ publishedOnly: true });
  sendSuccess(res, 200, "Public dashboard stats fetched", stats);
});
