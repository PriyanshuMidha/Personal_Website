import Joi from "joi";
import { querySchema } from "./commonSchemas.js";

export const adminEducationQuerySchema = querySchema;

export const educationSchema = Joi.object({
  degree: Joi.string().required(),
  institution: Joi.string().required(),
  startYear: Joi.number().integer().required(),
  endYear: Joi.number().integer().allow(null),
  grade: Joi.string().allow(""),
  description: Joi.string().allow(""),
  coursework: Joi.array().items(Joi.string()).default([]),
  isPublished: Joi.boolean().default(false),
  displayOrder: Joi.number().integer().min(0).default(0),
});

