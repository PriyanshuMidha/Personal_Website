import Joi from "joi";
import { querySchema } from "./commonSchemas.js";

export const adminAchievementQuerySchema = querySchema.keys({
  isFeatured: Joi.boolean().optional(),
});

export const achievementSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().allow(""),
  description: Joi.string().allow(""),
  impact: Joi.string().allow(""),
  date: Joi.date().allow(null),
  isFeatured: Joi.boolean().default(false),
  isPublished: Joi.boolean().default(false),
  displayOrder: Joi.number().integer().min(0).default(0),
});
