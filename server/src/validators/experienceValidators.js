import Joi from "joi";
import { querySchema } from "./commonSchemas.js";

export const adminExperienceQuerySchema = querySchema;

export const experienceSchema = Joi.object({
  company: Joi.string().required(),
  role: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().allow(null),
  isCurrent: Joi.boolean().default(false),
  location: Joi.string().allow(""),
  description: Joi.string().allow(""),
  responsibilities: Joi.array().items(Joi.string()).default([]),
  achievements: Joi.array().items(Joi.string()).default([]),
  techStack: Joi.array().items(Joi.string()).default([]),
  isPublished: Joi.boolean().default(false),
  displayOrder: Joi.number().integer().min(0).default(0),
});

