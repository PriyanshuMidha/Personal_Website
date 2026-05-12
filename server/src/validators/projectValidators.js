import Joi from "joi";
import { fileMetadataSchema, querySchema } from "./commonSchemas.js";

export const PROJECT_STATUS_OPTIONS = ["Live", "In Progress", "Archived"];
export const PROJECT_CATEGORY_OPTIONS = ["Backend", "Full Stack", "Frontend", "Automation", "Tool", "Other"];

export const adminProjectQuerySchema = querySchema.keys({
  isFeatured: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
});

export const projectSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().allow(""),
  shortDescription: Joi.string().required(),
  longDescription: Joi.string().allow(""),
  problemSolved: Joi.string().allow(""),
  techStack: Joi.array().items(Joi.string()).default([]),
  features: Joi.array().items(Joi.string()).default([]),
  githubUrl: Joi.string().uri().allow(""),
  liveUrl: Joi.string().uri().allow(""),
  screenshots: Joi.array().items(fileMetadataSchema).default([]),
  category: Joi.string().valid(...PROJECT_CATEGORY_OPTIONS).default("Other"),
  status: Joi.string().valid(...PROJECT_STATUS_OPTIONS).default("Live"),
  isFeatured: Joi.boolean().default(false),
  isPublished: Joi.boolean().default(false),
  displayOrder: Joi.number().integer().min(0).default(0),
});
